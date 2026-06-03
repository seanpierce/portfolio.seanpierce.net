# [portfolio.seanpierce.net](https://portfolio.seanpierce.net)

A simple portfolio website displaing some of the professional and personal work of Sean Pierce Sumler (that's me).

"I'm a creative technologist with over a decade of experience bringing projects from concept to completion for enterprise organizations. I've spent my career building, scaling, and modernizing software across a wide range of industries. **I've seen some things!**"

## Keeping it simple

This site uses plain html, css, and js. No frameworks, no bloat, no dependencies. Frameworks and component libraries are great, I use them often, but you wouldn't use a chainsaw to cut a slice of bread.

### Reader View

In an effort to appeal to corporarte employers as well as design-focussed agencies, I've added a "Reader View" verison of the site. When in Reader View, images, are hidden, and all fonts are standardized. Animations and transforms are also removed.

Reader View is auto-enabled if a user visits the site using a query param `?readerview=true`, _or_ if the referrer is from LinkedIn. Users may also manually toggle Reader View on or off using a CTA on the site.

### Dark Mode

I've also added Dark Mode - because my eyes are tired and I'm willing to bet yours are, too. The funcitonality works similar to Reader View, with the exception that your selection (if you choose Dark Mode) will be remembered in local storage and recalled when you vist the site again. 

## DevOps and hosting

This site is hosted on an Ubuntu cloud server and served using nginx. A Github Action is responsible for automated deployments ([see more in the wiki](https://github.com/seanpierce/portfolio.seanpierce.net/wiki/Deployments-via-GitHub-Actions)). Do less!

## Get in touch

Questions? Want to connect? --> sumler.sean@gmail.com