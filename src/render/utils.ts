import WidgetRepository from '../shared/widget'
import { Config } from '../shared/config'

const configSizes = new Config("appearence.items.sizes.fields")
const configColors = new Config("appearence.items.color.fields")

document.documentElement.style.setProperty('--barsize', configSizes.get("height.value")+'px')
document.documentElement.style.setProperty('--padding', configSizes.get("padding.value")+'px')

document.documentElement.style.setProperty('--accent', configColors.get("accent.value"))
document.documentElement.style.setProperty('--primary', configColors.get("primary.value"))
document.documentElement.style.setProperty('--secondary', configColors.get("secondary.value"))

export function loadWidgets() {
  const widgetController = new WidgetRepository()
  widgetController.loadWidgetsInPaths(true)
}


export function loadTheme() {
  const themeConfig = new Config('appearence.items.theme.fields.selected')
  
  const style = document.createElement('link')
  style.setAttribute('rel', 'stylesheet')
  style.setAttribute('href', `theme://${themeConfig.get('value')}/index.css`)

  document.head.appendChild(style)

}

setTimeout(() =>{
  const hyperbody = document.getElementById("hyperbar")

  if (hyperbody) {
    hyperbody.style.overflowY = "hidden"
    hyperbody.style.overflowX = "hidden"
    hyperbody.style.height = configSizes.get("height.value") + 'px'
  }
}, 100)
