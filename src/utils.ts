import * as core from '@actions/core';
import fs from 'node:fs';
import {
  DEFAULT_ANIME_FORMAT,
  DEFAULT_MANGA_FORMAT,
  FORMAT_TOKEN_PREFIX,
} from './constants';

function formatString(tokens: IFormatTokens, format: string) {
  for (const [key, value] of Object.entries(tokens)) {
    format = format.replace(
      `${FORMAT_TOKEN_PREFIX}${key}`,
      String(value !== null ? value : ''),
    );
  }
  return format;
}

export function formatAnimeEntry(entry: IAnime, format = DEFAULT_ANIME_FORMAT) {
  let tokens = {
    id: entry['anime_id'],
    t: entry['anime_title'],
    T: entry['anime_title_eng'],
    s: entry['score'],
    wep: entry['num_watched_episodes'],
    tep: entry['anime_num_episodes'],
    sd: entry['start_date_string'],
    ed: entry['finish_date_string'],
    amt: entry['anime_media_type_string'],
  };

  return formatString(tokens, format);
}

export function formatMangaEntry(entry: IManga, format = DEFAULT_MANGA_FORMAT) {
  let tokens = {
    id: entry['manga_id'],
    t: entry['manga_title'],
    T: entry['manga_english'],
    s: entry['score'],
    cr: entry['num_read_chapters'],
    tc: entry['manga_num_chapters'],
    vr: entry['num_read_volumes'],
    tv: entry['manga_num_volumes'],
    sd: entry['start_date_string'],
    fd: entry['finish_date_string'],
    mmt: entry['manga_media_type_string'],
  };

  return formatString(tokens, format);
}

export function formatListToTxt(
  data: IAnimeList | IMangaList,
  listType: IListTypes,
) {
  if (listType === 'animelist') {
    const anime_format =
      core.getInput('anime_string_format') || DEFAULT_ANIME_FORMAT;

    return data
      .map((entry) => formatAnimeEntry(entry, anime_format))
      .join('\n');
  } else if (listType === 'mangalist') {
    const manga_format =
      core.getInput('manga_string_format') || DEFAULT_MANGA_FORMAT;

    return data
      .map((entry) => formatMangaEntry(entry, manga_format))
      .join('\n');
  }
}

export function mkdir(dir: string) {
  if (fs.existsSync(dir)) return;
  core.info('Creating output dir...');

  fs.mkdirSync(dir, { recursive: true });
  core.info(`Created output directory: '${dir}'`);
}

export function writeFile(dir: string, data: string | NodeJS.ArrayBufferView) {
  fs.writeFileSync(dir, data, {
    encoding: 'utf8',
  });
}
