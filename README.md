### 天気スクショslack送付

`yarn install`

### 起動

node weather.js

### Heroku へデプロイ heroku/master のみ OK
環境変数も登録  
https://dashboard.heroku.com/apps/slack-weather-osaka/scheduler  
utc11:00pm = jtc8:00am  
git add .  
git commit -m "fix"  
git push heroku master

heroku logs --tail

### 他 参考

build package 追加後はキャッシュクリアが必要  
https://help.heroku.com/18PI5RSY/how-do-i-clear-the-build-cache  
heroku builds:cache:purge -a slack-weather-osaka  
https://qiita.com/tamanugi/items/8cc1266265457f13b9ea  

### URL化
https://imagekit.io/use-cases/file-upload/

### LINE

https://liff.line.me/1645278921-kWRPP32q/?accountId=456qfgav
