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
  it('Should return formatted string', () => {
    const format = '[%id%] - %title% - [%episodes%/%total%]';
    const expectedString = '[123456] - GH Action - [5/10]';
    const customEntry = {
      id: 123456,
      title: 'GH Action',
      episodes: 5,
      total: 10,
    };

    expect(utils.formatString(customEntry, format)).toEqual(expectedString);
  });

  it('Should return formatted string with null token value as "?"', () => {
    const format = '[%id%] - %title% - %unknown%';
    const expectedString = '[123456] - GH Action - ?';
    const customEntry = {
      id: 123456,
      title: 'GH Action',
      unknown: null,
    };

    expect(utils.formatString(customEntry, format)).toEqual(expectedString);
  });

  it('Should not remove unspecified tokens', () => {
    const format = '[%id%] - %title% - %unknownProp%';
    const expectedString = '[123456] - GH Action - %unknownProp%';
    const customEntry = {
      id: 123456,
      title: 'GH Action',
    };

    expect(utils.formatString(customEntry, format)).toEqual(expectedString);
  });

  it('Should return formatted anime string', () => {
    const animeFormat = '[%id%] - %t% - [%wep%/%tep%]';
    const expectedString = '[28851] - Koe no Katachi - [1/1]';

    expect(utils.formatAnimeEntry(animeSample, animeFormat)).toEqual(
      expectedString,
    );
  });

  it('Should fallback to original title if there is no english title', () => {
    const animeFormat = '[%id%] - %T%';
    const expectedString = '[28851] - Koe no Katachi';

    expect(
      utils.formatAnimeEntry(
        {
          ...animeSample,
          anime_title_eng: null,
        },
        animeFormat,
      ),
    ).toEqual(expectedString);

    expect(
      utils.formatAnimeEntry(
        {
          ...animeSample,
          anime_title_eng: '',
        },
        animeFormat,
      ),
    ).toEqual(expectedString);
  });

  it('Should return formatted manga string', () => {
    const mangaFormat = '[%mmt%] - %T% - [%cr%/%tc%]';
    const expectedString = '[Manga] - Cheerful Amnesia - [53/67]';

    expect(utils.formatMangaEntry(mangaSample, mangaFormat)).toEqual(
      expectedString,
    );
  });

  it('Should return formatted list', () => {
    const animeList = [animeSample, animeSample];
    const expectedString = 'Koe no Katachi - Ep 1/1\nKoe no Katachi - Ep 1/1';

    expect(utils.formatListToTxt(animeList, 'animelist')).toEqual(
      expectedString,
    );
  });
});
