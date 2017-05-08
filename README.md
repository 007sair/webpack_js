# fe webpack配置文件

## 命令

### 开发环境

```
webpack --config config/groupon5.4.js -w
```
### 生产环境

```
webpack --config config/groupon5.4.js --prod
```


其中`fe_config/groupon5.4.js` = `webpack.config.js`

### 注意

1. `resources/webpack/config/`目录下是一个项目对应`resources/webpack/project/xxx项目目录/`一个源文件目录
2. 开发环境会生产xxx.js.map文件，用于调试，请在最后上线前执行生产环境命令
