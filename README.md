# sk-propulsion-state
SignalK node server plugin that reads a GPIO port and reflects it into propulsion.main.state

![image](https://github.com/marcobergman/sk-propulsion-state/assets/17980560/8992e420-6848-4f8b-9f93-4343407e1821)

The plugin [does not allow specifying pull-up resistors](https://www.npmjs.com/package/onoff#configuring-pullup-and-pulldown-resistors) for the GPIO port. If you want to do so, add a similar line to /boot/config.txt:
```
gpio=27=ip,pu
```
