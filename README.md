Utility javascript utils.js
====================

run <a href='https://rawgit.com/pragle/utils.js/master/example.html'>example.html</a> to check functionalities of :
<br />
```javascript
utils.Logger
utils.Observer
```
####utils.Observer
inspired by actionscript EventDispatcher
<br />
can dispatch, listen, remove events with data ex.
<br />
```javascript
var o = new utils.Observer();
o.listen('e', function(data) {
    alert('from first');
});
o.listen('e', function(data) {
    alert('from second');
});
o.dispatch('e', 'test');
o.removeTypeAllListeners('e');
o.dispatch('e', 'test');
```
<br />
Other
<br />
```javascript
utils.HTTP
```