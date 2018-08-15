declare function cls(c: col): void
declare function flr(n: number): number
declare function print(v: string | number): void
declare function max(a: number, b: number): number
declare function sqrt(n: number): number
declare function stop(): void
declare function assert(b: boolean): void
declare function sin(n: number): number
declare function cos(n: number): number

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

let vec3_mul_mat3
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
