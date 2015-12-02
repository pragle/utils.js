Utility javascript utils.js
====================

<p>run example.html to check functionalities of :</p> 
<pre>
utils.Logger
utils.Observer
</pre>
<h4>utils.Observer<h4>
<p>inspired by actionscript EventDispatcher</p>
<p>can dispatch, listen, remove events with data ex.</p>
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
```
<p>Other : </p>
<pre>
utils.HTTP
</pre>