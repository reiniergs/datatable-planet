/* eslint-disable lwc/no-document-query */
import { createElement } from 'lwc';
import MyApp from 'my/app';

document
    .querySelector('#main')
    .appendChild(createElement('my-app', { is: MyApp }));
