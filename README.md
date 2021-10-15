# Wheel of Fortune test assignment
**Vlad Šutov**

The demo of the solution is **[available here](https://wheel-of-fortune-murex.vercel.app/)**

## Notes

The test assignment has been developed with these things in mind:
- The amount of levels is fixed
- The amount of prizes per level is not limited
- The styling of the wheel of fortune is hardcoded
- Redux Toolkit - in the scope of the assignment it might seem like an unnecessary overhead, however it has been added to the stack having in the mind the fact that a potential real-word implementation will most likely fetch required data from the API using RTK Query. In the scope of the demo, the API request has been mocked using a simple Promise and an async thunk
- **The amount the player will win is pre-defined** and exists in at least one of the levels' prizes, in the demo it is set to 23


## Interaction with API
The application is expecting a response from the API in the following format:

```js
{
  levels: [
    {
      prizes: [1, 2, 3, 4, 5, 5, 6, 6, 8]
    },
    {
      prizes: [9, 10, 11, 15]
    },
    {
      prizes: [23]
    }
  ],
  winAmount: 23,
  currency: 'EUR',
  locale: 'et-EE'
}
```

It should be noted that the response was made transparent to the end-user on purpose, real-word implementation will most likely serve this with token/other encrypted format.

After the fulfillment of the request, state is populated with modified data from the response. The `currency` and the `locale` properties are needed to generate labels for sectors of the wheel using the `generateFormattedCurrencyString` util that returns a `Intl.NumberFormat` string, then they are omitted from the object. Every game, prizes are shuffled to "spice things up" by the `shufflePrizes` util.

In the end, state object looks like following (given that the currency and locale properties are defined as above):

```js
{
  levels: [
    {
      sectors: [
        {
          value: 1,
          label: '5 €'
        },
        ...
      ]
    },
    ...
  ],
  winAmount: 23,
  ready: true
}

```

The `ready` property indicates the application that the data is ready for the `Wheel.tsx` component to consume.


## Rendering

The wheel of fortune is entirely rendered using HTML5 Canvas with the exception of the CTA button. 

The colors of the sectors are picked based on the current level, total amount of levels and sector index by the `pickSectorColor` util.

The text inside the sector depends on whether or not the sector has a value (in case of "level up" sectors, the value is set to `0`) or not. For "level up" sectors, IcoFont chevron is used instead. The font string is generated using the `buildFontString` util.

## Game process

The game begins after the user presses the CTA button and continues until the `winAmount` has been found in the current level sectors' value and the spinning to the aforementioned sector has concluded.
