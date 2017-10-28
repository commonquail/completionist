# Completionist

<https://mkjeldsen.gitlab.io/completionist/>

*Completionist* retrieves today's Guild Wars 2 *Daily Completionist* [[daily]]
achievements from the official API [[gw2-api]] and annotates them with helpful
information. Users can mark "favourite" achievements so as to easily form an
idea of how to earn the final *Daily Completionist* achievement.

The primary motivation behind this project was the *Daily Recommended Fractal*
achievements not including the Fractal names, as well as lacking an easy
overview of how much effort earning the *Daily Completionist* achievement
would require.

## Prior art

- **gw2efficiency** [[gw2ef-daily]] provides a list of many "dailies",
  including both achievements for *Daily Completionist* as well as activities
  not exposed through the official API, such as node gathering. It supports
  flagging a "daily" as completed, which can be useful for managing large
  numbers of "dailies" but is substantially less useful when dealing with just
  a few. It provides a mechanism for hiding uninteresting "dailies" but no way
  to draw attention to interesting ones. gw2efficiency is not open-source.

- **daily.thatshaman.com** [[shaman-daily]] provides an aggregate list of all
  achievements returned by the `/v2/achievements/daily` endpoint
  [[gw2-api-daily]], annotated with helpful information. It has no tracking or
  ahead-of-time filtering mechanisms. daily.thatshaman.com is source-available.

## Installation

Run `yarn install` followed by `yarn production` to generate a production
distribution inside `public/`.

### Development

Run `yarn tslint` lint and `yarn test` to execute automatic tests.

Run `yarn build` to build a development distribution inside `public/` and open
`public/index.html` in a browser either via file protocol:

```sh
$ xdg-open public/index.html
```

or an ad-hoc Web server:

```sh
# in a separate, dedicated terminal
$ python3 -m http.server
```

```sh
$ xdg-open http://localhost:8000/public
```

Run `yarn add --exact --dev <package>` to install new dependencies, followed
by `./update-licenses` to regenerate license information.

## License

Original source code is licensed under Apache-2.0 according to `LICENSE.txt`.
It includes third party software licensed according to `NOTICE.txt` and
`third-party.txt`, both of which are generated automatically with
`update-licenses`. This is not strictly in line with ASF's guidelines for
application [[license], [notice]] but this approach both greatly eases the
burden of maintenance and avoids the recursive license duplication that would
occur if software derived from this distribution were to generate license
information in the same way.

[daily]: https://wiki.guildwars2.com/wiki/Daily
[gw2-api-daily]: https://wiki.guildwars2.com/wiki/API:2/achievements/daily
[gw2-api]: https://wiki.guildwars2.com/wiki/API:Main
[gw2ef-daily]: https://gw2efficiency.com/daily
[license]: https://www.apache.org/dev/apply-license.html#new "Applying the license to new software"
[notice]: https://www.apache.org/legal/src-headers.html#notice "NOTICE file"
[shaman-daily]: https://www.thatshaman.com/tools/daily/
