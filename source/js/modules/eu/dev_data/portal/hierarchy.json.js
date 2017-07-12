define([], function(){

  var dataGen = function() {

      for (var a = {
              data: []
          }, log = function(a) {
              console.log(a)
          }, c = function(a) {
              return {
                  def: [a]
              }
          }, d = 1; d <= 15; d++) {
          a.data[a.data.length] = {
              id: d + "",
              index: d,
              title: c("Book " + d),
              type: "text",
              data: []
          };
          for (var e = 1; e <= 15; e++) {
              var f = a.data[a.data.length - 1];
              f.data[f.data.length] = {
                  id: d + "-" + e,
                  index: e,
                  title: c("Volume " + e + " (b" + d + ")"),
                  type: "text",
                  data: []
              };
              for (var g = 1; g <= 14; g++) {
                  var h = f.data[f.data.length - 1];
                  h.data[h.data.length] = {
                      id: d + "-" + e + "-" + g,
                      index: g,
                      title: c("Chapter " + g + " (b" + d + ", v" + e + ")"),
                      type: "text",
                      data: []
                  };
                  for (var i = 1; i <= 14; i++) {
                      var j = h.data[h.data.length - 1];
                      j.data[j.data.length] = {
                          id: d + "-" + e + "-" + g + "-" + i,
                          index: i,
                          title: c("Verse " + i + " (b" + d + ", v" + e + ", c" + g + ")"),
                          type: "text",
                          data: []
                      };
                      for (var k = 1; k <= 14; k++) {
                          var l = j.data[j.data.length - 1];
                          l.data[l.data.length] = {
                              id: d + "-" + e + "-" + g + "-" + i + "-" + k,
                              index: k,
                              title: c("Word " + i + " (b" + d + ", v" + e + ", c" + g + " (" + k + "))"),
                              type: "text"
                          }
                      }
                  }
              }
          }
      }
      var m = function(a, b) {
              return {
                  id: a.slice(0, a.length - 1).join("-"),
                  title: search(a.slice(0, a.length - 1).join("-"), "self.json", b).self.title,
                  type: "TEXT",
                  index: a[a.length - 2],
                  hasChildren: !0,
                  relBefore: a[a.length - 2] < 11
              }
          },
          n = function(a, b) {
              if (a) {
                  var c = {
                      id: a.id,
                      title: a.title,
                      type: a.type,
                      index: a.index,
                      hasChildren: b ? null : "object" == typeof a.data,
                      relBefore: a.index < 11
                  };
                  return c.hasChildren && !b && (c.childrenCount = a.data.length), c
              }
          },
          search = function(c, d, e) {
              log("search on id: " + c + " with action: " + d + " and limit: " + e + " typeof " + typeof e);
              var f = {
                      action: d
                  },
                  g = c.split("-"),
                  h = a;
              if (!h) return !1;
              for (var i = 0; i < g.length; i++) log("parseInt(path[i]) = " + parseInt(g[i]) + "    --> " + h.data.length), h = h.data[parseInt(g[i]) - 1];
              if ("self.json" === d) f.self = n(h), f.self && g.length > 1 && (f.self.parent = m(g, e).id);
              else if ("children.json" === d) {
                  if (f.self = {
                          id: c
                      }, g.length > 1 && (f.self.parent = m(g, e).id), h.data) {
                      f.children = [];
                      for (var j = "undefined" == typeof e ? h.data.length : Math.min(e, h.data.length), i = 0; i < j; i++) f.children.push(n(h.data[i], !0))
                  }
              } else if ("following-siblings.json" === d) {
                  if (f.self = {
                          id: c
                      }, g.length > 1) {
                      f.self.parent = m(g, e).id;
                      var k = (g.slice(0, g.length - 1).join("-"), search(g.slice(0, g.length - 1).join("-"), "children.json")),
                          l = !1,
                          p = 0;
                      k.children.length && k.children.length > 1 && (f["following-siblings"] = []);
                      for (var i = 0; i < k.children.length; i++) {
                          if (l) {
                              var q = n(k.children[i]),
                                  r = search(q.id, "self.json", 1);
                              if (q.hasChildren = r.self.hasChildren, q.hasChildren && (q.childrenCount = r.self.childrenCount), f["following-siblings"].push(q), p++, p == e) break
                          }
                          l || k.children[i].id != c || (l = !0)
                      }
                  }
                  h.data
              } else if ("preceding-siblings.json" === d) {
                  if (f.self = {
                          id: c
                      }, g.length > 1) {
                      f.self.parent = m(g, e).id;
                      var k = search(g.slice(0, g.length - 1).join("-"), "children.json"),
                          l = !1,
                          p = 0;
                      k.children.length > 1 && (f["preceding-siblings"] = []);
                      for (var i = k.children.length - 1; i >= 0; i--) {
                          if (l) {
                              var s = n(k.children[i]),
                                  r = search(s.id, "self.json", 1);
                              if (s.hasChildren = r.self.hasChildren, s.hasChildren && (s.childrenCount = r.self.childrenCount), f["preceding-siblings"].push(s), p++, p == e) break
                          }
                          l || k.children[i].id != c || (l = !0)
                      }
                  }
              }
              else if ("ancestor-self-siblings.json" === d) {
                  f.self = n(h);

                  var t = search(g.join("-"), "preceding-siblings.json", 8);

                  console.log('preceding search ' + g.join("-") + '  res = ' + t.length );

                  f["preceding-siblings"] = t["preceding-siblings"];
                  var u = search(g.join("-"), "following-siblings.json", 8);

                  console.log('following search ' + g.join("-") + '  res = ' + u.length );

                  if (f["following-siblings"] = u["following-siblings"],
                          console.log(''),
                          console.log(''),
                          g.length > 1 && (f.self.parent = m(g, e).id), g.pop(), g.length)
                      for (f.ancestors = []; g.length;) f.ancestors.push(search(g.join("-"), "self.json", 1)), g.pop()
              }
              return f
          };
      return {
        search: search
      }
  }();

  return {
    getData: function(params){
      var data = dataGen.search(params.id, params.action, params.limit ? parseInt(params.limit) : 10)
      data.success = true;
      return data;
    },
    processParams: function(path, params){
      params = params ? params : {};

      var key = path.split(/[\S]*\/templates[^\/]*\//);
      key = key[key.length-1].replace('hierarchy/', '');

      if(key.indexOf('/')>-1){
        params['id']     = key.split('/')[0].replace('record', '');
        params['action'] = key.split('/')[1];
      }
      else{
        params['action'] = key;
      }
      if(!params['id']){
        params['id'] = '1';
      }
      return params;
    }
  };
});