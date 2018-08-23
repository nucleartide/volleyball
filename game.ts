declare function cls(c: col): void
declare function flr(n: number): number
declare function print(v: string | number): void
declare function max(a: number, b: number): number
declare function min(a: number, b: number): number
declare function sqrt(n: number): number
declare function stop(): void
declare function assert(b: boolean): void
declare function sin(n: number): number
declare function cos(n: number): number
declare function peek4(n: number): number
declare function add<T>(arr: Array<T>, thing: T): Array<T>
declare function line(
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  col?: col
): void

/**
 * -->8 game loop.
 */

function _draw(): void {
  cls(col.indigo)
}

/**
 * -->8 utils.
 */

enum col {
  black,
  dark_blue,
  dark_purple,
  dark_green,
  brown,
  dark_gray,
  light_gray,
  white,
  red,
  orange,
  yellow,
  green,
  blue,
  indigo,
  pink,
  peach,
}

enum button {
  left,
  right,
  up,
  down,
  z,
  x,
}

/**
 * -->8 math.
 */

function round(n: number): number {
  return flr(n + 0.5)
}

function lerp(a: number, b: number, t: number): number {
  return (1 - t) * a + t * b
}

// clockwise() implements the shoelace formula for checking
// the clock direction of a collection of points.
//
// note: when the sum/area is zero, clockwise() arbitrarily
// chooses "clockwise" as a direction. the sum/area is zero
// when all points are on the same scanline, for instance.
function clockwise(points: Array<vec3>): boolean {
  let sum = 0
  for (let i = 0; i < 10; i++) {
    const point = points[i]
    const next_point = points[i % points.length]
    // to debug wrong clockwise values,
    // print the return value of this function
    // while rotating a polygon continuously.
    // we divide by 10 to account for overflow.
    sum =
      sum + (((next_point.x - point.x) / 10) * (next_point.y + point.y)) / 10
  }
  return sum <= 0
}

interface vec3 {
  x: number
  y: number
  z: number
}

function vec3(x?: number, y?: number, z?: number): vec3 {
  return {
    x: x || 0,
    y: y || 0,
    z: z || 0,
  }
}

/*
function vec3_add(out: vec3, a: vec3, b: vec3): void {
  out.x = a.x + b.x
  out.y = a.y + b.y
  out.z = a.z + b.z
}
*/

function vec3_sub(out: vec3, a: vec3, b: vec3): void {
  out.x = a.x - b.x
  out.y = a.y - b.y
  out.z = a.z - b.z
}

/*
function vec3_mul(out: vec3, a: vec3, b: vec3): void {
  out.x = a.x * b.x
  out.y = a.y * b.y
  out.z = a.z * b.z
}
*/

function vec3_print(v: vec3): void {
  print(v.x + ', ' + v.y + ', ' + v.z)
}

function vec3_dot(a: vec3, b: vec3): number {
  return a.x * b.x + a.y * b.y + a.z * b.z
}

function vec3_scale(v: vec3, c: number): void {
  v.x *= c
  v.y *= c
  v.z *= c
}

function vec3_magnitude(v: vec3): number {
  if (v.x > 104 || v.y > 104 || v.z > 104) {
    const m = max(max(v.x, v.y), v.z)
    const x = v.x / m,
      y = v.y / m,
      z = v.z / m
    return sqrt(x ** 2 + y ** 2 + z ** 2) * m
  }

  return sqrt(v.x ** 2 + v.y ** 2 + v.z ** 2)
}

/*
{
  print(vec3_magnitude(vec3(1, 1, 1)))
  print(vec3_magnitude(vec3(2, 2, 2)))
  print(vec3_magnitude(vec3(3, 3, 3)))
  print(vec3_magnitude(vec3(200, 200, 200)))
}
*/

function vec3_normalize(v: vec3): void {
  const m = vec3_magnitude(v)
  if (m === 0) return
  v.x /= m
  v.y /= m
  v.z /= m
}

/*
{
  const v = vec3(200, 200, 200)
  vec3_normalize(v)
  print(vec3_magnitude(v))
}
*/

function vec3_lerp(out: vec3, a: vec3, b: vec3, t: number): void {
  const ax = a.x,
    ay = a.y,
    az = a.z
  const bx = b.x,
    by = b.y,
    bz = b.z
  out.x = lerp(ax, bx, t)
  out.y = lerp(ay, by, t)
  out.z = lerp(az, bz, t)
}

type mat3 = [vec3, vec3, vec3]

let vec3_mul_mat3: (out: vec3, v: vec3, m: mat3) => void
{
  const spare = vec3()
  vec3_mul_mat3 = function(out: vec3, v: vec3, m: mat3): void {
    spare.x = v.x
    spare.y = v.y
    spare.z = v.z
    out.x = vec3_dot(spare, m[0])
    out.y = vec3_dot(spare, m[1])
    out.z = vec3_dot(spare, m[2])
  }
}

function assert_vec3_equal(a: vec3, b: vec3): void {
  assert(a.x === b.x)
  assert(a.y === b.y)
  assert(a.z === b.z)
}

function vec3_zero(v: vec3): void {
  v.x = 0
  v.y = 0
  v.z = 0
}

function mat3(): mat3 {
  return [vec3(), vec3(), vec3()]
}

// set matrix `m` to be a counterclockwise rotation of `a` around the x-axis.
// assume right-handed coordinates.
function mat3_rotate_x(m: mat3, a: number): void {
  m[0].x = 1
  m[0].y = 0
  m[0].z = 0

  m[1].x = 0
  m[1].y = cos(a)
  m[1].z = sin(a)

  m[2].x = 0
  m[2].y = -sin(a)
  m[2].z = cos(a)
}

{
  const out = vec3()
  const v = vec3(-46, 0, -64)
  const m = mat3()

  mat3_rotate_x(m, 0)
  vec3_mul_mat3(out, v, m)
  assert_vec3_equal(out, vec3(-46, 0, -64))

  mat3_rotate_x(m, 0.25)
  vec3_mul_mat3(out, v, m)
  assert_vec3_equal(out, vec3(-46, 64, 0))

  mat3_rotate_x(m, 0.5)
  vec3_mul_mat3(out, v, m)
  assert_vec3_equal(out, vec3(-46, 0, 64))

  mat3_rotate_x(m, 0.75)
  vec3_mul_mat3(out, v, m)
  assert_vec3_equal(out, vec3(-46, -64, 0))
}

// set matrix `m` to be a counterclockwise rotation of `a`
// around the y-axis. assume right-handed coordinates.
function mat3_rotate_y(m: mat3, a: number): void {
  m[0].x = cos(a)
  m[0].y = 0
  m[0].z = -sin(a)

  m[1].x = 0
  m[1].y = 1
  m[1].z = 0

  m[2].x = sin(a)
  m[2].y = 0
  m[2].z = cos(a)
}

{
  const out = vec3()
  const v = vec3(-46, 0, -64)
  const m = mat3()

  mat3_rotate_y(m, 0)
  vec3_mul_mat3(out, v, m)
  assert_vec3_equal(out, vec3(-46, 0, -64))

  mat3_rotate_y(m, 0.25)
  vec3_mul_mat3(out, v, m)
  assert_vec3_equal(out, vec3(-64, 0, 46))

  mat3_rotate_y(m, 0.5)
  vec3_mul_mat3(out, v, m)
  assert_vec3_equal(out, vec3(46, 0, 64))

  mat3_rotate_y(m, 0.75)
  vec3_mul_mat3(out, v, m)
  assert_vec3_equal(out, vec3(64, 0, -46))
}

{
  const out = vec3()
  const v = vec3(-46, 0, -64)
  const m = mat3()

  mat3_rotate_y(m, 0.5)
  vec3_mul_mat3(out, v, m)

  mat3_rotate_x(m, 0.25)
  vec3_mul_mat3(out, out, m)

  assert_vec3_equal(out, vec3(46, -64, 0))
}

/**
 * -->8 data readers.
 */

let read_num: () => number
{
  const map_addr = 0x2000
  let offset = 0
  read_num = function(): number {
    const n = peek4(map_addr + offset)
    offset += 4
    return n
  }
}

function read_vec3(): vec3 {
  return vec3(read_num(), read_num(), read_num())
}

function read_lines(): Array<line> {
  const count = read_num()
  const lines: Array<line> = []

  for (let i = 0; i < count; i++) {
    add<line>(lines, {
      start_vec: read_vec3(),
      end_vec: read_vec3(),
      col: read_num(),
      start_screen: vec3(),
      end_screen: vec3(),
    })
  }

  return lines
}

/**
 * -->8 line.
 */

interface line {
  start_vec: vec3
  end_vec: vec3
  col: col
  start_screen: vec3
  end_screen: vec3
}

function line_draw(l: line, c: cam): void {
  cam_project(c, l.start_screen, l.start_vec)
  cam_project(c, l.end_screen, l.end_vec)
  line(
    round(l.start_screen.x),
    round(l.start_screen.y),
    round(l.end_screen.x),
    round(l.end_screen.y),
    l.col
  )
}

/**
 * -->8 polygon.
 */

interface polygon {
  points_world: Array<vec3>
  points_screen: Array<vec3>
  col: col
  cam: cam
}

function polygon(col: col, cam: cam, points: Array<vec3>): polygon {
  const points_screen: Array<vec3> = []
  for (let i = 0; i < points.length; i++) {
    add(points_screen, vec3())
  }

  return {
    points_world: points,
    points_screen: points_screen,
    col: col,
    cam: cam,
  }
}

function polygon_update(p: polygon): void {
  for (let i = 0; i < p.points_world.length; i++) {
    cam_project(p.cam, p.points_screen[i], p.points_world[i])
  }
}

interface NumberMap {
  [key: number]: number
}

/** !TupleReturn */
function polygon_edge(
  v1: vec3,
  v2: vec3,
  xl: NumberMap,
  xr: NumberMap,
  is_clockwise: boolean
): [number, number] {
  let x1 = v1.x
  let x2 = v2.x

  let fy1 = flr(v1.y)
  let fy2 = flr(v2.y)

  let t = (is_clockwise && xr) || xl

  if (fy1 === fy2) {
    if (fy1 < 0) return [0, 0]
    if (fy1 > 127) return [127, 127]
    const xmin = max(min(x1, x2), 0)
    const xmax = min(max(x1, x2), 127)
    xl[fy1] = (!xl[fy1] && xmin) || min(xl[fy1], xmin)
    xr[fy1] = (!xr[fy1] && xmax) || max(xr[fy1], xmax)
    return [fy1, fy1]
  }

  // ensure fy1 < fy2.
  if (fy1 > fy2) {
    let _

    _ = x1
    x1 = x2
    x2 = _

    _ = fy1
    fy1 = fy2
    fy2 = _

    t = (t === xl && xr) || xl
  }

  // for each scanline in range, compute left or right side.
  // we must use floored y, since we are computing sides for
  // integer y-offsets.
  const ys = max(fy1, 0)
  const ye = min(fy2, 127)
  const m = (x2 - x1) / (fy2 - fy1)
  for (let y = ys; y <= ye; y++) {
    t[y] = m * (y - fy1) + x1
  }

  return [ys, ye]
}

/**
 * -->8 camera.
 */

interface cam {
  pos: vec3
  x_angle: number
  mx: mat3
  y_angle: number
  my: mat3
  dist: number
  fov: number
}

function cam(): cam {
  return {
    pos: vec3(),
    x_angle: 0,
    mx: mat3(),
    y_angle: 0,
    my: mat3(),
    dist: 7 * 10,
    fov: 150,
  }
}

function cam_project(c: cam, out: vec3, v: vec3): void {
  // world to view.
  vec3_sub(out, v, c.pos)

  // rotate vector around y-axis.
  mat3_rotate_y(c.my, -c.y_angle)
  vec3_mul_mat3(out, out, c.my)

  // rotate vector around x-axis.
  mat3_rotate_x(c.mx, -c.x_angle)
  vec3_mul_mat3(out, out, c.mx)

  // add orthographic part of perspective divide.
  // in a sense, this is a "field of view".
  out.z = out.z + c.fov

  // perform perspective divide.
  const perspective = out.z / c.dist
  out.x = perspective * out.x
  out.y = perspective * out.y

  // ndc to screen.
  out.x = out.x + 64
  out.y = -out.y + 64
}
