# [portfolio.seanpierce.net](https://portfolio.seanpierce.net)

A simple portfolio website displaing some of the professional and personal work of Sean Pierce Sumler (that's me).

"I'm a creative technologist with over a decade of experience bringing projects from concept to completion for enterprise organizations. I've spent my career building, scaling, and modernizing software across a wide range of industries. **I've seen some things!**"

## Keeping it simple

This site uses plain html, css, and js. No frameworks, no bloat, no dependencies. Frameworks and component libraries are great, I use them often, but you wouldn't use a chainsaw to cut a slice of bread.

### Reader View

In an effort to appeal to corporarte employers as well as design-focussed agencies, I've added a "Reader View" verison of the site. When in Reader View, images, are hidden, and all fonts are standardized. Animations and transforms are also removed.

Reader View is auto-enabled if a user visits the site using a query param `?readerview=true`, _or_ if the referrer is from LinkedIn. Users may also manually toggle Reader View on or off using a CTA on the site.

### Dark Mode

I've also added Dark Mode - because my eyes are tired and I'm willing to bet yours are, too. Unlike Reader View, your Dark Mode preference will be saved to local storage and automatically restored the next time you visit the site.

## DevOps and hosting

This site is hosted on an Ubuntu cloud server and served using Nginx. A Github Action is responsible for automated deployments ([see more in the wiki](https://github.com/seanpierce/portfolio.seanpierce.net/wiki/Deployments-via-GitHub-Actions)). Do less!

## Asset Caching

Static assets are cached aggressively via nginx cache headers. The Github `deploy` action contains a step that injects a commit-based version query string into asset references in HTML, enabling precise cache invalidation only when assets change.

## Get in touch

Questions? Want to connect? --> sumler.sean@gmail.com