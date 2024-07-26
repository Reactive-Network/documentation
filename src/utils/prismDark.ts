/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { themes, type PrismTheme } from 'prism-react-renderer';

const baseTheme = themes.vsDark;

export default {
  plain: {
    color: '#86868B',
    backgroundColor: '#1D1D1F',
  },
  styles: [
    ...baseTheme.styles,
    {
      types: ['title'],
      style: {
        color: '#62d0ff',
        fontWeight: 'bold',
      },
    },
    {
      types: ['property', 'parameter'],
      style: {
        color: '#2DC0FF',
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
        color: '#FFA055',
      },
    },
    {
      types: ['string'],
      style: {
        color: '#FF8F2E',
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