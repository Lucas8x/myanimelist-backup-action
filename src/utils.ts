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
    ed: entry['end_date_string'],
  };

  return formatString(tokens, format);
}

export function formatMangaEntry(entry: IManga, format = DEFAULT_MANGA_FORMAT) {
  let tokens = {
    id: entry['manga_id'],
    t: entry['manga_title'],
    s: entry['score'],
    cr: entry['num_read_chapters'],
    tc: entry['manga_num_chapters'],
    rv: entry['num_read_volumes'],
    tv: entry['manga_num_volumes'],
    sd: entry['start_date_string'],
    fd: entry['finish_date_string'],
  };

  return formatString(tokens, format);
}

export function formatListToTxt(f: (entry: {}) => string, data: Array<{}>) {
  return data.map((entry) => f(entry)).join('\n');
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
