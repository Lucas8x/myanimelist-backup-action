import * as core from '@actions/core';
import path from 'node:path';
import { LIST_STATUS, MAL_LIST_TYPES } from './constants';
import { isGhAction } from './env';
import { Github } from './github';
import { formatListToTxt, mkdir, writeFile } from './utils';

const github = isGhAction && new Github();

async function preCommit(data: string, outputDir: string, fileName: string) {
  if (!isGhAction) {
    const outputPath = path.resolve(outputDir);
    const filePath = path.join(outputPath, fileName);
    mkdir(outputPath);
    writeFile(filePath, data);
    return;
  }

  const filePath = path.join(outputDir, fileName);
  core.info(`Commiting ${filePath}`);
  await github.commit(data, filePath);
}

const hideUsername = core.getBooleanInput('hide_username');

export class MAL {
  private animeList: IAnimeList = [];
  private mangaList: IMangaList = [];

  constructor(public username: string) {
    this.animeList = [];
    this.mangaList = [];
  }

  async fetch(listType: IListTypes) {
    if (!MAL_LIST_TYPES.includes(listType)) {
      throw new Error(`Invalid fetch list type: ${listType}`);
    }

    let offset = 0;
    const data = [];
    const apiURL = `https://myanimelist.net/${listType}/${this.username}/load.json`;

    while (true) {
      try {
        const params = new URLSearchParams({
          offset: `${offset}`,
          status: `${LIST_STATUS.all}`,
        });

        core.info(
          `Fetching ${hideUsername ? '' : this.username + ' '}${listType} list... [${offset}]`,
        );

        const response = await fetch(`${apiURL}?${params.toString()}`);
        if (!response.ok) {
          throw new Error(
            `Failed to fetch ${listType} list: ${response.status} ${response.statusText}`,
          );
        }

        const resData = await response.json();
        if (resData.length === 0) {
          break;
        }

        data.push(...resData);
        offset += 300;
      } catch (error) {
        core.error(
          error instanceof Error ? error.message : 'Unknown fetch error',
        );
        throw error;
      }
    }

    core.info(`${data.length} ${listType} entries found.`);
    return data;
  }

  async fetchAnimeList() {
    this.animeList = await this.fetch('animelist');
  }

  async fetchMangaList() {
    this.mangaList = await this.fetch('mangalist');
  }

  private formatFilename(fileName: string) {
    return hideUsername ? fileName : `${this.username}_${fileName}`;
  }

  async rawSave(outputDir: string) {
    await preCommit(
      JSON.stringify(this.animeList, null, 2),
      outputDir,
      this.formatFilename('raw_anime_list.json'),
    );

    await preCommit(
      JSON.stringify(this.mangaList, null, 2),
      outputDir,
      this.formatFilename('raw_manga_list.json'),
    );
  }

  async save(outputDir: string) {
    await preCommit(
      formatListToTxt(this.animeList, 'animelist'),
      outputDir,
      this.formatFilename('anime_list.txt'),
    );

    await preCommit(
      formatListToTxt(this.mangaList, 'mangalist'),
      outputDir,
      this.formatFilename('manga_list.txt'),
    );
  }
}
