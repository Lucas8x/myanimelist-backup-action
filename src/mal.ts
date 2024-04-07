import * as core from '@actions/core';
import path from 'node:path';
import { LIST_STATUS, MAL_LIST_TYPES } from './constants';
import { commit } from './github';
import { formatListToTxt } from './utils';

async function preCommit(data: any, outputDir: string, fileName: string) {
  if (!data.length) return;
  const filePath = path.join(outputDir, fileName);
  core.info(`Commiting ${filePath}`);
  await commit(data, filePath);
}

export class MAL {
  constructor(
    public username: string,
    public animeList: IAnimeList = [],
    public mangaList: IMangaList = [],
  ) {}

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

        core.info(`Fetching ${this.username} ${listType} list... [${offset}]`);

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

  async rawSave(outputDir: string) {
    await preCommit(
      JSON.stringify(this.animeList, null, 2),
      outputDir,
      `${this.username}_raw_anime_list.json`,
    );

    await preCommit(
      JSON.stringify(this.mangaList, null, 2),
      outputDir,
      `${this.username}_raw_manga_list.json`,
    );
  }

  async save(outputDir: string) {
    await preCommit(
      formatListToTxt(this.animeList, 'animelist'),
      outputDir,
      `${this.username}_anime_list.txt`,
    );

    await preCommit(
      formatListToTxt(this.mangaList, 'mangalist'),
      outputDir,
      `${this.username}_manga_list.txt`,
    );
  }
}
