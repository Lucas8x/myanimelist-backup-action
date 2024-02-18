import fs from 'node:fs';
import path from 'node:path';
import * as utils from '../src/utils';

const animeSample = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'samples/anime.json'), {
    encoding: 'utf8',
  }),
);

const mangaSample = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'samples/manga.json'), {
    encoding: 'utf8',
  }),
);

describe('Utils', () => {
  it('Should return formatted anime string', () => {
    const animeFormat = '[%id%] - %t% - [%wep%/%tep%]';
    const expectedString = '[28851] - Koe no Katachi - [1/1]';

    expect(utils.formatAnimeEntry(animeSample, animeFormat)).toEqual(
      expectedString,
    );
  });

  it('Should return formatted manga string', () => {
    const mangaFormat = '[%mmt%] - %T% - [%cr%/%tc%]';
    const expectedString = '[Manga] - Cheerful Amnesia - [53/67]';

    expect(utils.formatMangaEntry(mangaSample, mangaFormat)).toEqual(
      expectedString,
    );
  });
});
