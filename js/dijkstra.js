(function() {
  var add_arrow_head, add_node, connect_edge, draw, draw_arrow_head, draw_edge, draw_edges, draw_node, draw_nodes, draw_route, edge_color, find_paths, get_distance_nodes, get_node, get_route, new_dijkstra, new_dijkstra_data, no_node, node_color, node_radius, reset_data, route_color, set_current_location, test, total_nodes, unreachable;

  node_radius = 2;

  node_color = "red";

  edge_color = "blue";

  route_color = "purple";

  unreachable = Infinity;

  no_node = -1;

  new_dijkstra = function() {
    var dijkstra;
    dijkstra = {};
    dijkstra.current_location = no_node;
    dijkstra.nodes = [];
    return dijkstra;
  };

  window.dijkstra_new = new_dijkstra;

  new_dijkstra_data = function() {
    return {
      dist: unreachable,
      came_from: no_node,
      visited: false
    };
  };

  reset_data = function(dijkstra) {
    var i, _results;
    i = 0;
    _results = [];
    while (i < dijkstra.nodes.length) {
      dijkstra.nodes[i].data = new_dijkstra_data();
      _results.push(i++);
    }
    return _results;
  };

  window.allow_intersect = true;

  get_distance_nodes = function(dijkstra, a_index, b_index) {
    var a, b;
    a = dijkstra.nodes[a_index].node;
    b = dijkstra.nodes[b_index].node;
    return getLength(a.x, a.y, b.x, b.y);
  };

  find_paths = function(dijkstra) {
    var a_queue, dist, here, i, neighbor, _results;
    reset_data(dijkstra);
    here = dijkstra.current_location;
    dijkstra.nodes[here].data.dist = 0;
    a_queue = [here];
    _results = [];
    while (a_queue.length > 0) {
      here = a_queue[0];
      a_queue.splice(0, 1);
      dijkstra.nodes[here].data.visited = true;
      i = 0;
      _results.push((function() {
        var _results1;
        _results1 = [];
        while (i < dijkstra.nodes[here].neighbors.length) {
          neighbor = dijkstra.nodes[here].neighbors[i];
          dist = get_distance_nodes(dijkstra, here, neighbor);
          dist += dijkstra.nodes[here].data.dist;
          if (dist < dijkstra.nodes[neighbor].data.dist) {
            dijkstra.nodes[neighbor].data.dist = dist;
            dijkstra.nodes[neighbor].data.came_from = here;
            a_queue.push(neighbor);
          }
          _results1.push(i++);
        }
        return _results1;
      })());
    }
    return _results;
  };

  window.dijkstra_find_paths = find_paths;

  get_route = function(dijkstra, a_index) {
    var here, route;
    here = a_index;
    route = [];
    if (dijkstra.nodes[here].data.came_from === no_node) {
      return null;
    }
    while (dijkstra.current_location !== here) {
      route.unshift(here);
      here = dijkstra.nodes[here].data.came_from;
    }
    return route;
  };

  window.dijkstra_get_route = get_route;

  set_current_location = function(dijkstra, node_index) {
    if (node_index >= 0 && node_index < dijkstra.nodes.length) {
      return dijkstra.current_location = node_index;
    } else {
      return console.log("Dijkstra set_current_location: invalid node_index.");
    }
  };

  window.dijkstra_set_current_location = set_current_location;

  add_node = function(dijkstra, node) {
    var data;
    data = new_dijkstra_data();
    dijkstra.nodes.push({
      node: node,
      neighbors: [],
      data: data
    });
    return dijkstra.nodes.length - 1;
  };

  window.dijkstra_add_node = add_node;

  get_node = function(dijkstra, node_index) {
    return dijkstra.nodes[node_index].node;
  };

  window.dijkstra_get_node = get_node;

  total_nodes = function(dijkstra) {
    return dijkstra.nodes.length;
  };

  window.dijkstra_total_nodes = total_nodes;

  draw_node = function(node, canvas) {
    var ctx;
    ctx = canvas.getContext("2d");
    ctx.strokeStyle = node_color;
    ctx.beginPath();
    ctx.arc(node.x, node.y, node_radius, 0, 2 * Math.PI);
    return ctx.stroke();
  };

  window.dijkstra_draw_node = draw_node;

  connect_edge = function(dijkstra, a_index, b_index) {
    if (!(a_index < dijkstra.nodes.length && b_index < dijkstra.nodes.length)) {
      console.log("dijkstra_connect_edge: Error: a_index or b_index not valid");
      return;
    }
    return dijkstra.nodes[a_index].neighbors.push(b_index);
  };

  window.dijkstra_connect_edge = connect_edge;

  draw_nodes = function(dijkstra, canvas) {
    var i, _results;
    i = 0;
    _results = [];
    while (i < dijkstra.nodes.length) {
      draw_node(dijkstra.nodes[i].node, canvas);
      _results.push(i++);
    }
    return _results;
  };

  draw_edge = function(canvas, color, node1, node2) {
    var ctx;
    ctx = canvas.getContext("2d");
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(node1.x, node1.y);
    ctx.lineTo(node2.x, node2.y);
    ctx.stroke();
    return window.chart_add_arrow_head(node1, node2);
  };

  draw_edges = function(dijkstra, canvas) {
    var i, j, node1, node2, node2_index, num_neighbors, num_nodes, _results;
    num_nodes = dijkstra.nodes.length;
    i = 0;
    _results = [];
    while (i < num_nodes) {
      node1 = dijkstra.nodes[i];
      num_neighbors = node1.neighbors.length;
      j = 0;
      while (j < num_neighbors) {
        node2_index = node1.neighbors[j];
        node2 = dijkstra.nodes[node2_index].node;
        draw_edge(canvas, edge_color, node1.node, node2);
        j++;
      }
      _results.push(i++);
    }
    return _results;
  };

  window.dijkstra_draw_edges = draw_edges;

  draw = function(dijkstra, canvas) {
    draw_nodes(dijkstra, canvas);
    return draw_edges(dijkstra, canvas);
  };

  window.dijkstra_draw = draw;

  draw_route = function(dijkstra, canvas, route) {
    var i, node1, node2, _results;
    if (route === null) {
      return;
    }
    node1 = dijkstra.nodes[dijkstra.current_location].node;
    i = 0;
    _results = [];
    while (i < route.length) {
      node2 = dijkstra.nodes[route[i]].node;
      draw_edge(canvas, route_color, node1, node2);
      node1 = node2;
      _results.push(i++);
    }
    return _results;
  };

  window.dijkstra_draw_route = draw_route;

  draw_arrow_head = function(arrow_head) {
    var canvas, ctx;
    canvas = document.getElementById("my_canvas");
    ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(arrow_head[0][0], arrow_head[0][1]);
    ctx.lineTo(arrow_head[1][0], arrow_head[1][1]);
    ctx.lineTo(arrow_head[2][0], arrow_head[2][1]);
    return ctx.stroke();
  };

  add_arrow_head = function(origin, dest) {
    var angle, arrow_head, length;
    length = 10;
    arrow_head = [];
    arrow_head[0] = [length, 0, 1];
    arrow_head[1] = [0, 0, 1];
    arrow_head[2] = [0, length, 1];
    angle = getRadiansBetweenPoints(origin.x, origin.y, dest.x, dest.y);
    arrow_head = rotate(arrow_head, (3.0 / 4.0) * Math.PI);
    arrow_head = rotate(arrow_head, angle);
    arrow_head = translate(arrow_head, dest.x, dest.y);
    return draw_arrow_head(arrow_head);
  };

  window.chart_add_arrow_head = add_arrow_head;

  test = function() {
    var canvas, dijkstra, route;
    canvas = document.getElementById("my_canvas");
    dijkstra = new_dijkstra();
    add_node(dijkstra, {
      x: 200,
      y: 200
    });
    add_node(dijkstra, {
      x: 200,
      y: 300
    });
    add_node(dijkstra, {
      x: 300,
      y: 200
    });
    add_node(dijkstra, {
      x: 300,
      y: 300
    });
    add_node(dijkstra, {
      x: 100,
      y: 250
    });
    add_node(dijkstra, {
      x: 400,
      y: 250
    });
    connect_edge(dijkstra, 0, 1);
    connect_edge(dijkstra, 0, 2);
    connect_edge(dijkstra, 1, 0);
    connect_edge(dijkstra, 1, 3);
    connect_edge(dijkstra, 2, 3);
    connect_edge(dijkstra, 3, 2);
    connect_edge(dijkstra, 4, 0);
    connect_edge(dijkstra, 3, 5);
    draw(dijkstra, canvas);
    console.log("set current location");
    set_current_location(dijkstra, 4);
    console.log("find paths!");
    find_paths(dijkstra);
    console.log("found paths!");
    console.log(dijkstra);
    route = get_route(dijkstra, 5);
    console.log("route");
    console.log(route);
    return draw_route(dijkstra, canvas, route);
  };

  window.dijkstra_test = test;

}).call(this);
