### How to calculate `widthFactor` and `heightFactor`?
Example:
1) Original width of image is `256`.
2) After drawing image it was found that proper width is `64 (256 * 0.25)`.
3) Current canvas size is `600`.
4) Scale: `64/600 = 0.106`.
5) Calculate width: `0.106 * CANVAS_SIZE`.