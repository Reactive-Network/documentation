/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { themes, type PrismTheme } from 'prism-react-renderer';

const baseTheme = themes.github;

export default {
    plain: {
        color: '#1D1D1F',
        backgroundColor: '#F5F5F7',
    },
    styles: [
        ...baseTheme.styles,
        {
            types: ['title'],
            style: {
                color: '#009ECC',
                fontWeight: 'bold',
            },
        },
        {
            types: ['property', 'parameter'],
            style: {
                color: '#62D0FF',
            },
        },
        {
            types: ['script'],
            style: {
                color: '#333336',
            },
        },
        {
            types: ['boolean', 'arrow', 'atrule', 'tag'],
            style: {
                color: '#009ECC',
            },
        },
        {
            types: ['number', 'color', 'unit'],
            style: {
                color: '#92F4A0',
            },
        },
        {
            types: ['font-matter'],
            style: {
                color: '#FF8F2E',
            },
        },
        {
            types: ['keyword', 'rule'],
            style: {
                color: '#CBB5FF',
            },
        },
        {
            types: ['regex', 
                "entity",
                "url",
                "symbol",
                "number",
                "boolean",
                "variable",
                "constant",
                "property",
                "regex",
                "inserted"],
            style: {
                color: '#FF2E36',
            },
        },
        {
            types: ['maybe-class-name'],
            style: {
                color: '#00C853',
            },
        },
        {
            types: ['constant'],
            style: {
                color: '#02BBF0',
            },
        },
        {
            types: ['function'],
            style: {
                color: '#FFA055',
            },
        },
        {
            types: ['title'],
            style: {
                color: '#02BBF0',
                fontWeight: 'bold',
            },
        },
        {
            types: ['property', 'parameter'],
            style: {
                color: '#02BBF0',
            },
        },
        {
            types: ['script'],
            style: {
                color: '#86868B',
            },
        },
        {
            types: ['boolean', 'arrow', 'atrule', 'tag'],
            style: {
                color: '#00ADF7',
            },
        },
        {
            types: ['number', 'color', 'unit'],
            style: {
                color: '#92F4A0',
            },
        },
        {
            types: ['font-matter'],
            style: {
                color: '#FF8F2E',
            },
        },
        {
            types: ['keyword', 'rule'],
            style: {
                color: '#8758FF',
            },
        },
        {
            types: ['regex'],
            style: {
                color: '#F78071',
            },
        },
        {
            types: ['maybe-class-name'],
            style: {
                color: '#00C853',
            },
        },
        {
            types: ['constant'],
            style: {
                color: '#02BBF0',
            },
        },
        {
            types: ['function'],
            style: {
                color: '#FF8F2E',
            },
        },
        {
            types: ['string'],
            style: {
                color: '#D87215',
            },
        },
        {
            types: ['punctuation'],
            style: {
                color: '#D87215',
            },
        },
        {
            types: ['token, url'],
            style: {
                color: '#2756FC',
            },
        },
    ],
} satisfies PrismTheme;