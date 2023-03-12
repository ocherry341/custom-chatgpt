> This project is for demonstration and testing purposes only. Please do not use it for commercial purposes!

# CustomGPT

<div style="font-size: 1.5rem;">
  <a href="./README-zh.md">中文</a> |
  <a href="./README.md">English</a>
</div>
</br>

A front-end application developed based on ChatGPT API.

## Online Preview
https://www.customgpt.top/

## Features

- Question and answer function consistent with the ChatGPT official website
- Custom API parameters
- Custom API base URL
- Save configuration parameters
- Save message list

## Usage
1. [Get an API Key](https://platform.openai.com/account/api-keys/).
2. Modify the API parameters in settings, supporting settings saving and reading.
3. Save your conversations at any node, such as saving [Awesome ChatGPT Prompts](https://github.com/f/awesome-chatgpt-prompts) for easy use next time.

> All settings and API Keys are saved locally, and the server does not save any content.

## Known Issues

- Markdown rendering: Text dynamic changes will cause page flicker.
- logit_bias param
  - Cannot correctly parse Chinese token IDs.
  - Using this parameter according to the [official instructions](https://help.openai.com/en/articles/5247780-using-logit-bias-to-define-token-probability) cannot achieve the expected effect.
  - Output abnormalities or slow request issues may occur when the value is too large.

## Development

This project is generated with [Angular CLI](https://github.com/angular/angular-cli) version 15.2.1. Check [Angular official documents](https://angular.io/cli) for more help.

### Development Environment Configuration

Run `npm i` to install the project dependencies, and run `ng serve` to start the development server. You can access the application in the browser by entering `http://localhost:4201/`. The code can be updated in real time.

### Packing and Deployment

Run the `ng build --localize` command to package the project. The packaged web files are saved in the `dist/` directory.
