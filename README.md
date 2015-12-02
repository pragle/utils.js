Utility javascript utils.js
====================

run example.html to check functionalities of : 
```javascript
utils.Logger
utils.Observer
```
####utils.Observer
inspired by actionscript EventDispatcher
can dispatch, listen, remove events with data ex.
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
<p>Other : </p>
<pre>
utils.HTTP
</pre>