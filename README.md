# MyAnimeList Github Action

Github action to save your MyAnimeList in the repository

![gh-actions](https://img.shields.io/badge/github%20actions-%232671E5.svg?style=for-the-badge&logo=githubactions&logoColor=white)
![typescript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![nodejs](https://img.shields.io/badge/Node%20js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![prettier](https://img.shields.io/badge/prettier-1A2C34?style=for-the-badge&logo=prettier&logoColor=F7BA3E)

## 🚀 Example usage

Basic example, this example executes every Monday.

```yaml
name: Backup MyAnimeList

on:
  schedule:
    - cron: 0 0 * * MON
  workflow_dispatch:

jobs:
  save-list:
    runs-on: ubuntu-latest

    steps:
      - name: Run MAL action
        uses: lucas8x/myanimelist-backup-action@main
        with:
          mal_username: ${{ vars.MAL_USERNAME }}
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

<details>
  <summary>Full Example</summary>

  ```yaml
  name: Backup MyAnimeList

  on:
    schedule:
      - cron: 0 0 * * MON
    workflow_dispatch:

  jobs:
    save-list:
      runs-on: ubuntu-latest

      steps:
        - name: Run MAL action
          uses: lucas8x/myanimelist-backup-action@main
          with:
            mal_username: ${{ vars.MAL_USERNAME }}
            mal_list_type: ${{ vars.MAL_LIST_TYPE }}
            output_dir: ${{ vars.MAL_OUTPUT_DIR }}
            anime_string_format: ${{ vars.ANIME_STRING_FORMAT }}
            manga_string_format: ${{ vars.MANGA_STRING_FORMAT }}
          env:
            GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
  ```

</details>
</br>

Need help on how set variables? Check out this: [Creating configuration variables for a repository](https://docs.github.com/en/actions/learn-github-actions/variables#creating-configuration-variables-for-a-repository)</br>
You can also change directly on the workflow file like this: `mal_username: ${{ vars.MAL_USERNAME }}` to `mal_username: 'lucas8x'`

## ⚙ Settings

| Input                  | Description                                      | Default       | Required |
| ---------------------- | ------------------------------------------------ | ------------- | -------- |
| `mal_username`         | Your MyAnimeList Username                        |               | ✔        |
| `mal_list_type`        | Which list to save (anime, manga, both)          | `both`        |          |
| `output_dir`           | Where to save the files in repository            | `.`           |          |
| `anime_string_format`  | How anime string will be formatted on txt file   | '%t - Ep %wep/%tep' | |
| `manga_string_format`  | How manga string will be formatted on txt file   | '%t - Ch %cr/%tc - Vol %vr/%tv' | |

## 📺 Anime Format Tokens

| Token                  | Description                                            | Example          |
| ---------------------- | -----------------------------------------------------  | ---------------- |
| `%id`                  | Anime id                                               | 28851            |
| `%t`                   | Anime title                                            | `Koe no Katachi` |
| `%T`                   | English Anime title                                    | `A Silent Voice` |
| `%s`                   | Your anime score                                       | 10               |
| `%wep`                 | Episodes you watched                                   | 1                |
| `%tep`                 | Total anime episodes                                   | 1                |
| `%sd`                  | When you started watching                              | 18-05-17         |
| `%ed`                  | When you finished watching                             | 18-05-17         |
| `%amt`                 | What kind of anime (TV, OVA, Movie,...)                | Movie            |

All anime types: `TV` `OVA` `Movie` `Special` `ONA` `Music` `CM` `PV` `TV Special`

Example: `[%id] - %t - [%wep/%tep]`

Result: `[28851] - Koe no Katachi - [1/1]`

## 📚 Manga Format Tokens

| Token                  | Description                                         | Example                  |
| ---------------------- | --------------------------------------------------- | ------------------------ |
| `%id`                  | Manga id                                            | 103162                   |
| `%t`                   | Manga title                                         | `Akarui Kioku Soushitsu` |
| `%T`                   | English Manga title                                 | `Cheerful Amnesia`       |
| `%s`                   | Your manga score                                    | 10                       |
| `%cr`                  | Chapters you read                                   | 53                       |
| `%tc`                  | Total manga chapters                                | 67                       |
| `%vr`                  | Volumes you read                                    | 6                        |
| `%tv`                  | Total manga volumes                                 | 6                        |
| `%sd`                  | When you started reading                            | 20-08-19                 |
| `%fd`                  | When you finished reading                           | 24-02-22                 |
| `%mmt`                 | What kind of manga (Manga, Light Novel,...)         | Manga                    |

All manga types: `Manga` `One-shot` `Doujinshi` `Light Novel` `Novel` `Manhwa` `Manhua`

Example: `[%mmt] - %T - [%cr/%tc]`

Result: `[Manga] - Cheerful Amnesia - [53/67]`

## 📝 License

This project is under [MIT](./LICENSE) license.
