# Know Testing Issues

## Untestable Websites

These websites often times are using a dynamically generated key to validate auth state and aggressively blocks bots from clicking to get a key using CAPTCHA

-   https://beta.character.ai
-   https://chat.openai.co

## Partially Tested Websites

These websites have some form of bot detection that prevents automated testing, but can be partially tested. We can test the username autofill but not the password in most cases.

-   https://walmart.com
-   https://indeed.com
-   https://twitter.com
-   https://yahoo.com
