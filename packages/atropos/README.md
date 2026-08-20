> [!NOTE]  
> This project is part of the [ZikoJS](https://github.com/zakarialaoui10/ziko.js) ecosystem.

# ziko-atropos

<!-- 
Overview Or Description
Doc
-->

## Install

```bash
npm i ziko-atropos 
```

## Usage

```js
import { Atropos } from '@zikojs/atropos'
import { tags } from 'ziko/dom'

const a = Atropos(
    tags.div().style({
        width : '100%',
        height : '100%',
        background : 'blue'
    })
).style({
    border : '2px darkblue dotted',
    width : '400px',
    height : '300px',
    margin : '20px auto'
})
a.mount(document.body)
```

## Features

# ⭐️ Show your support

If you appreciate the library, kindly demonstrate your support by giving it a star!<br>

<!--## Financial support-->

# Licence
This projet is licensed under the terms of MIT License
