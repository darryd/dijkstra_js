
#------------------------------------------------------------------------------------------------------------------------------------#
# Constants

node_radius = 2
node_color = "red"
edge_color = "blue"
route_color = "purple"

unreachable = Infinity #Number.MAX_VALUE
no_node = -1

#------------------------------------------------------------------------------------------------------------------------------------#

# Create a new Dijkstra object
new_dijkstra = -> 
  
  dijkstra = {}

  dijkstra.current_location = no_node
  dijkstra.nodes = []

  dijkstra

window.dijkstra_new = new_dijkstra
#------------------------------------------------------------------------------------------------------------------------------------#

new_dijkstra_data = -> { dist: unreachable, came_from: no_node, visited:  false }

#------------------------------------------------------------------------------------------------------------------------------------#

# Reset all data for all nodes

reset_data = (dijkstra) ->
  
  i = 0
  while i < dijkstra.nodes.length
    dijkstra.nodes[i].data = new_dijkstra_data()
    i++

#------------------------------------------------------------------------------------------------------------------------------------#
window.allow_intersect = true
get_distance_nodes = (dijkstra, a_index, b_index) ->
 
 a = dijkstra.nodes[a_index].node
 b = dijkstra.nodes[b_index].node
 
 # Check for intersecting other arrows.
 
 #path = []
 #path.push(a)
 #path.push(b)

 #if not window.allow_intersect 
 #  return Infinity if window.does_path_intersect_with_any_flights(path)

 return getLength(a.x, a.y, b.x, b.y)

#------------------------------------------------------------------------------------------------------------------------------------#
find_paths = (dijkstra) -> 
  
  reset_data(dijkstra)

  here = dijkstra.current_location
  dijkstra.nodes[here].data.dist = 0

  a_queue = [here]

  while a_queue.length > 0

    here = a_queue[0]
    a_queue.splice(0, 1)
    
    dijkstra.nodes[here].data.visited = true

    i = 0
    while i < dijkstra.nodes[here].neighbors.length

      neighbor = dijkstra.nodes[here].neighbors[i]

      dist = get_distance_nodes(dijkstra, here, neighbor)
      dist += dijkstra.nodes[here].data.dist

      if dist < dijkstra.nodes[neighbor].data.dist
        dijkstra.nodes[neighbor].data.dist = dist
        dijkstra.nodes[neighbor].data.came_from = here
        a_queue.push(neighbor)
       
      i++

window.dijkstra_find_paths = find_paths
#------------------------------------------------------------------------------------------------------------------------------------#

# Get Route
# Returns array containing the nodes to get from the current location to the destination
# (not including the current location).
# If the a_index is an unreachable node, null is returned
get_route = (dijkstra, a_index) ->

  here = a_index
  route = []

  if dijkstra.nodes[here].data.came_from == no_node
    return null

  while dijkstra.current_location != here
    route.unshift(here)
    here = dijkstra.nodes[here].data.came_from 
    
  route

window.dijkstra_get_route = get_route

#------------------------------------------------------------------------------------------------------------------------------------#
# Set the current_location node

set_current_location = (dijkstra, node_index) ->
  
  if node_index >= 0 and node_index < dijkstra.nodes.length
    dijkstra.current_location = node_index
  else
    console.log "Dijkstra set_current_location: invalid node_index."

window.dijkstra_set_current_location = set_current_location

#------------------------------------------------------------------------------------------------------------------------------------#

#Add a new node
#returns index of the node, so that you may refer to it later
add_node = (dijkstra, node) ->
  
  data = new_dijkstra_data()

  dijkstra.nodes.push({node: node, neighbors: [], data: data})
  dijkstra.nodes.length - 1 # This is the index for the node.  This is the return value of the function.

window.dijkstra_add_node = add_node

#------------------------------------------------------------------------------------------------------------------------------------#

# Get Node
get_node = (dijkstra, node_index) ->
  
  dijkstra.nodes[node_index].node

window.dijkstra_get_node = get_node

#------------------------------------------------------------------------------------------------------------------------------------#

# Get the total number of nodes in the Dijkstra object
total_nodes = (dijkstra) -> dijkstra.nodes.length

window.dijkstra_total_nodes = total_nodes

#------------------------------------------------------------------------------------------------------------------------------------#
# Draw a node on the canvas.
draw_node = (node, canvas) ->

  ctx=canvas.getContext("2d")
  ctx.strokeStyle = node_color
  ctx.beginPath()
  ctx.arc(node.x, node.y, node_radius,0,2*Math.PI)
  ctx.stroke()

window.dijkstra_draw_node = draw_node

#------------------------------------------------------------------------------------------------------------------------------------#

# Creates a directed edge going from a to b
# Note: this is unidirectional.
connect_edge = (dijkstra, a_index, b_index) ->
  
  if not (a_index < dijkstra.nodes.length and b_index < dijkstra.nodes.length)
    console.log "dijkstra_connect_edge: Error: a_index or b_index not valid"
    return

  dijkstra.nodes[a_index].neighbors.push(b_index)

window.dijkstra_connect_edge = connect_edge
#------------------------------------------------------------------------------------------------------------------------------------#
# Draw the nodes
draw_nodes = (dijkstra, canvas) ->

  i = 0
  while i < dijkstra.nodes.length
    draw_node(dijkstra.nodes[i].node, canvas)
    i++

#------------------------------------------------------------------------------------------------------------------------------------#
draw_edge = (canvas, color, node1, node2) ->

   ctx = canvas.getContext("2d");
   ctx.strokeStyle = color 
   ctx.lineWidth = 1
   ctx.beginPath();
   ctx.moveTo(node1.x, node1.y);
   ctx.lineTo(node2.x, node2.y);
   ctx.stroke();
   
#   ctx.strokeStyle = arrow_color;
   window.chart_add_arrow_head(node1, node2)

#------------------------------------------------------------------------------------------------------------------------------------#
draw_edges = (dijkstra, canvas) ->
   
  num_nodes = dijkstra.nodes.length

  i = 0
  while i < num_nodes

    node1 = dijkstra.nodes[i]
    num_neighbors = node1.neighbors.length
    j = 0
    while j < num_neighbors

      node2_index = node1.neighbors[j]
      node2 = dijkstra.nodes[node2_index].node
       
      draw_edge(canvas, edge_color, node1.node, node2)
      j++
    i++

window.dijkstra_draw_edges = draw_edges

#------------------------------------------------------------------------------------------------------------------------------------#

# Draw the graph on the canvas
#
draw = (dijkstra, canvas) ->
   
   draw_nodes(dijkstra, canvas)
   draw_edges(dijkstra, canvas)

window.dijkstra_draw = draw

#------------------------------------------------------------------------------------------------------------------------------------#

# Draw the route on the canvas

draw_route = (dijkstra, canvas, route) ->
  
  if route == null
    return

  node1 = dijkstra.nodes[dijkstra.current_location].node

  i = 0
  while i < route.length

    node2 = dijkstra.nodes[route[i]].node
    draw_edge(canvas, route_color, node1, node2)

    node1 = node2
    i++

window.dijkstra_draw_route = draw_route

#------------------------------------------------------------------------------------------------------------------------------------#

# Helper function for add_arrow_head

draw_arrow_head = (arrow_head) ->
  
  canvas = document.getElementById("my_canvas")
  ctx = canvas.getContext("2d")
  ctx.beginPath();
  ctx.moveTo(arrow_head[0][0], arrow_head[0][1])
  ctx.lineTo(arrow_head[1][0], arrow_head[1][1])
  ctx.lineTo(arrow_head[2][0], arrow_head[2][1])
  ctx.stroke()

#------------------------------------------------------------------------------------------------------------------------------------#

add_arrow_head = (origin, dest) ->
  
  length = 10

  arrow_head = []
  arrow_head[0] = [length, 0, 1]
  arrow_head[1] = [0, 0, 1]
  arrow_head[2] = [0, length, 1]

  angle = getRadiansBetweenPoints(origin.x, origin.y, dest.x, dest.y)
  
  arrow_head = rotate(arrow_head, (3.0/4.0) * Math.PI)
  arrow_head = rotate(arrow_head, angle)

  arrow_head = translate(arrow_head, dest.x, dest.y)

  draw_arrow_head (arrow_head) 

window.chart_add_arrow_head = add_arrow_head

#------------------------------------------------------------------------------------------------------------------------------------#

# Test Code

test = ->
  
  canvas = document.getElementById("my_canvas")

  dijkstra = new_dijkstra()

  add_node(dijkstra, {x: 200, y: 200})
  add_node(dijkstra, {x: 200, y: 300})
  add_node(dijkstra, {x: 300, y: 200})
  add_node(dijkstra, {x: 300, y: 300})
  add_node(dijkstra, {x: 100, y: 250})
  add_node(dijkstra, {x: 400, y: 250})

  
  connect_edge(dijkstra, 0, 1)
  connect_edge(dijkstra, 0, 2)
  connect_edge(dijkstra, 1, 0)
  connect_edge(dijkstra, 1, 3)
  connect_edge(dijkstra, 2, 3)
  connect_edge(dijkstra, 3, 2)
  connect_edge(dijkstra, 4, 0)
  connect_edge(dijkstra, 3, 5)



  draw(dijkstra, canvas)
  console.log "set current location"
  set_current_location(dijkstra, 4)
  console.log "find paths!"
  find_paths(dijkstra)
  console.log "found paths!"
 
  console.log dijkstra

  route = get_route(dijkstra, 5)
  console.log "route"
  console.log route 

  draw_route(dijkstra, canvas, route)

window.dijkstra_test = test
#------------------------------------------------------------------------------------------------------------------------------------#
