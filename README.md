# DevPosts

> This is a GitHub Action that will allow you to show your most recent blog posts from [DEV.TO](https://dev.to) in your README

## 🛠 Setup

- [x] Place these locator comment tags in your markdown file

```markdown
# 📝 Posts
<!-- devposts:start -->
<!-- devposts:end -->
```

- [x] Create a `.github/workflows` directory and make file named `devposts.yml` inside it

```yaml
name: Update Dev Posts
on: 
  workflow_dispatch:
  schedule:
    - cron: '0 * * * *'

jobs:
  update:
    runs-on: ubuntu-18.04
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v1
        with: 
          node-version: 12
      - uses: andrejarrell/devposts@v1
        with:
          # Make sure to replace username with yours
          posts_feed: https://dev.to/feed/username
          github_token: ${{ secrets.GH_TOKEN }}
          # Add any other settings here
```

- [x] Commit your files and read about [Events](#ℹ-events)

## ⚙ Settings

All settings will be placed in `devposts.yml`

| Name | Type | Required | Default | Description | ETC |
| -- | -- | -- | -- | -- | -- |
| **`github_token`** | `String` | `true` | N/A | Used to authenticate |
| **`posts_amount`** | `Number` | `false` | `0` | Amount of posts | `0` = all |
| **`posts_type`** | `String` | `false` | `table` | Table or List |
| **`posts_feed`** | `String` | `true` | N/A | URL for DEV feed | `https://dev.to/feed/username` |
| **`posts_file`** | `String` | `false` | `README.md` | File to be edited | Relative to root directory |
| **`posts_locator`** | `String` | `false` | `devposts` | Comment tag used to inject posts | `<!-- devposts:start -->` + `<!-- devposts:end -->` |
| **`date_format`** | `String` | `false` | `MM/DD/YYYY` | Format for date | [Moment.js Formats](https://momentjs.com/docs/#/displaying/format/) |
| **`commit_username`** | `String` | `false` | `workflow` | Name used when commiting |
| **`commit_email`** | `String` | `false` | `workflow@github.com` | Email used when commiting |
| **`commit_message`** | `String` | `false` | `Updated DEV Posts` | Message used when commiting |

## ℹ Events

### `workflow_dispatch` 

With this you can manually trigger your workflow rather than waiting.

Go to your repo -> `Actions` -> `Update Dev Posts` -> `Run workflow` -> `Run workflow`

### `schedule`

`- cron: '0 * * * *'`

This has been set to run every hour. You can change it using valid POSIX cron syntax.