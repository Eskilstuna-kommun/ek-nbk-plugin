# ek-nbk-plugin

This plugin allows origo to recieve POST messages when it is used within an iframe. The application will be able to act on two types of messages:
- Saving mapstate that is extended with print settings
- Parcel UUID to center the map

### Development

``npm run start`` will serve the demo site:  http://localhost:9008/demo/


Webpack will attemt to build the plugin to ``./../EK-extern/plugins``. Make sure to run [EK-extern](https://github.com/Eskilstuna-kommun/EK-extern) dev env in a folder paralell to this one.


### Example usage of ek-nbk-plugin

From parent application, a message can be posted to origo according to:
``` js
function sendMessage(message) {
  const iframeOrigin = new URL(iframeElement.src).origin;
  iframeElement.contentWindow.postMessage(message, iframeOrigin);
}
```

The message should be a stringified json:
``` js
/* Save mapstate */
const message = JSON.stringify({ 
    targetPlugin: 'origonbketuna', 
    type: 'mapstate', 
    data: {} 
    })

sendMessage(message)
```
``` js
/* Center the map over "some-parcel-uuid" */
const message = JSON.stringify({ 
    targetPlugin: 'origonbketuna', 
    type: 'parcel', 
    data: { 
        id: 'some-parcel-uuid' 
        }
    })
sendMessage(message)
```


**index.html:**
``` HTML
    <head>
    	<meta charset="utf-8">
    	<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
    	<meta http-equiv="X-UA-Compatible" content="IE=Edge;chrome=1">
    	<title>Origo exempel</title>
    	<link href="css/style.css" rel="stylesheet">
    	<link href="plugins/barebone.css" rel="stylesheet">
    </head>
    <body>
    <div id="app-wrapper">
    </div>
    <script src="js/origo.js"></script>
    <script src="plugins/origonbketuna.min.js"></script>

    <script type="text/javascript">
      //Init origo
		var origo = Origo('index.json');
		origo.on('load', function (viewer) {
            /*  The plugin can be run without input parameters. 
                These are the defaults */
            const defaultParams = { 
                paperSizes: {
                    a4: [210, 297],
                    a3: [297, 420],
                    a2: [420, 594],
                    a1: [594, 841]
                },
                initialPaperSize: 'a4',
                scales: ['1:400', '1:800', '1:1000', '1:10000'],
                initialScale: '1:400',
                allowedOrigins: ['http://localhost:9008'],
                previewAreaFillColor: 'rgba(123,104,238, 0.4)',
                previewAreaBorderColor: 'rgba(0, 0, 0, 0.7)',
                previewAreaBorderWidth: 2,
                parcelSearch: {
                    url: '/geoserver/wfs',
                    layer: 'lm_fastigheter',
                    attribute: 'objekt_id'
                }
			}
		var nbketuna = Origonbketuna(defaultParams);
		viewer.addComponent(nbketuna);
		});
    </script>
```
