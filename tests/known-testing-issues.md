# Know Testing Issues

## Untestable Websites

These websites often times are using a dynamically generated key to validate auth state and aggressively blocks bots from clicking to get a key using CAPTCHA

-   https://beta.character.ai
-   https://chat.openai.co
-   https://www.apple.com

## Partially Tested Websites

These websites have some form of bot detection that prevents automated testing, but can be partially tested. We can test the username autofill but not the password in most cases.

-   https://walmart.com
-   https://indeed.com - This site has a cloudflare captcha that is not solvable by Playwright's automation. It is possible to solve it manually and then run the test during a debug run.
-   https://twitter.com
-   https://yahoo.com
    https://www.homedepot.com - The flow for login on this is a bit strange. It requires an intermediary step that is a bit of a struggle to work around currently.
