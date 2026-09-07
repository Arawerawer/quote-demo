<script lang="ts">
export type SteelIconName =
  | 'bending'
  | 'c-channel'
  | 'angle'
  | 'flat-bar'
  | 'h-beam'
  | 'corrugated'
  | 'connector'
</script>

<script setup lang="ts">
/**
 * 鋼材品項的等角投影圖示，對應「視覺化參考.jpg」的視覺語言。
 *
 * 全部用 currentColor 描邊，外層給 text-* 就能換色；
 * 面的填色刻意分三階（亮面／暗面／端面），讓立體感不靠陰影也看得出來。
 */
withDefaults(
  defineProps<{
    name: SteelIconName
    size?: number | string
  }>(),
  {
    size: 48,
  },
)
</script>

<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 64 64"
    fill="none"
    stroke="currentColor"
    stroke-width="1.6"
    stroke-linejoin="round"
    stroke-linecap="round"
    aria-hidden="true"
    class="steel-icon"
  >
    <!-- 鋼板彎折：一塊板從中間折起來，折線留白最亮 -->
    <template v-if="name === 'bending'">
      <path class="face-top" d="M6 40 L26 28 L44 28 L24 40 Z" />
      <path class="face-side" d="M24 40 L44 28 L54 14 L34 26 Z" />
      <path
        class="face-end"
        d="M6 40 L24 40 L34 26 L44 28 L26 28 Z"
        fill="none"
      />
      <path d="M6 40 L26 28 L44 28 L54 14" />
      <path d="M6 44 L24 44 L34 30" class="edge-soft" />
      <path d="M6 40 L6 44" />
      <path d="M24 40 L24 44" />
      <path d="M34 26 L34 30" />
      <path d="M54 14 L54 18 L34 30" />
      <path d="M44 28 L44 32 L24 44" class="edge-soft" />
    </template>

    <!-- C 型鋼：開口朝右的斷面沿 (+26,-26) 擠出。
         面與稜線分開畫——面 stroke="none" 只填色，稜線只描邊，
         兩者疊在一起才是完整圖形。面的順序是畫家演算法排好的，不要重排。 -->
    <template v-else-if="name === 'c-channel'">
      <!-- 面（依畫家演算法由後往前） -->
      <path
        class="face-inner"
        stroke="none"
        d="M45.59 27.27 L30.82 42.05 L30.82 43.23 L46.77 27.27 Z"
      />
      <path
        class="face-inner"
        stroke="none"
        d="M56.82 21.95 L52.09 21.95 L30.82 43.23 L30.82 47.95 Z"
      />
      <path
        class="face-side"
        stroke="none"
        d="M30.82 58.0 L56.82 32.0 L56.82 21.95 L30.82 47.95 Z"
      />
      <path
        class="face-side"
        stroke="none"
        d="M30.82 42.05 L56.82 16.05 L56.82 6.0 L30.82 32.0 Z"
      />
      <path
        class="face-top"
        stroke="none"
        d="M30.82 32.0 L56.82 6.0 L33.18 6.0 L7.18 32.0 Z"
      />
      <path
        class="face-end"
        stroke="none"
        d="M7.18 32.0 L30.82 32.0 L30.82 42.05 L26.09 42.05 L26.09 36.73 L11.91 36.73 L11.91 53.27 L26.09 53.27 L26.09 47.95 L30.82 47.95 L30.82 58.0 L7.18 58.0 Z"
      />
      <!-- 可見稜線 -->
      <path d="M46.81 27.27 L45.56 27.27" />
      <path d="M30.82 47.95 L56.82 21.95" />
      <path d="M56.82 21.95 L52.09 21.95" />
      <path d="M52.09 21.95 L30.79 43.25" />
      <path d="M30.82 47.95 L30.82 58.0" />
      <path d="M30.82 58.0 L56.82 32.0" />
      <path d="M56.82 32.0 L56.82 21.95" />
      <path d="M30.82 32.0 L30.82 42.05" />
      <path d="M30.82 42.05 L56.82 16.05" />
      <path d="M56.82 16.05 L56.82 6.0" />
      <path d="M56.82 6.0 L30.82 32.0" />
      <path d="M7.18 32.0 L30.82 32.0" />
      <path d="M56.82 6.0 L33.18 6.0" />
      <path d="M33.18 6.0 L7.18 32.0" />
      <path d="M30.82 42.05 L26.09 42.05" />
      <path d="M26.09 42.05 L26.09 36.73" />
      <path d="M26.09 36.73 L11.91 36.73" />
      <path d="M11.91 36.73 L11.91 53.27" />
      <path d="M11.91 53.27 L26.09 53.27" />
      <path d="M26.09 53.27 L26.09 47.95" />
      <path d="M26.09 47.95 L30.82 47.95" />
      <path d="M30.82 58.0 L7.18 58.0" />
      <path d="M7.18 58.0 L7.18 32.0" />
    </template>

    <!-- 角鐵：L 形截面，兩片等寬 -->
    <template v-else-if="name === 'angle'">
      <path class="face-end" d="M16 48 L16 20 L23 20 L23 41 L46 41 L46 48 Z" />
      <path class="face-top" d="M16 20 L28 10 L35 10 L23 20 Z" />
      <path class="face-side" d="M46 41 L58 31 L58 38 L46 48 Z" />
      <path class="face-inner" d="M23 41 L35 31 L58 31 L46 41 Z" />
      <path d="M23 20 L35 10 L35 31" />
      <path d="M16 48 L28 38" class="edge-soft" />
      <path d="M28 38 L28 10" class="edge-soft" />
      <path d="M46 48 L58 38" class="edge-soft" />
    </template>

    <!-- 扁鐵：寬而薄的板沿 (+10,-10) 擠出。
         斷面 34 寬、8 厚，擠出量刻意壓小，
         看起來才是「寬」的一片板，不是「長」的一根條。 -->
    <template v-else-if="name === 'flat-bar'">
      <path class="face-top" d="M6 30 L16 20 L50 20 L40 30 Z" />
      <path class="face-side" d="M40 30 L50 20 L50 28 L40 38 Z" />
      <path class="face-end" d="M6 30 L40 30 L40 38 L6 38 Z" />
    </template>

    <!-- H 型鋼：工字截面躺著推出去 -->
    <template v-else-if="name === 'h-beam'">
      <path
        class="face-end"
        d="M10 20 L10 26 L26 26 L26 38 L10 38 L10 44 L44 44 L44 38 L28 38 L28 26 L44 26 L44 20 Z"
      />
      <path class="face-top" d="M10 20 L22 10 L56 10 L44 20 Z" />
      <path class="face-side" d="M44 20 L56 10 L56 16 L44 26 Z" />
      <path class="face-inner" d="M26 26 L38 16 L56 16 L44 26 Z" />
      <path class="face-inner" d="M28 38 L40 28 L56 28 L44 38 Z" />
      <path class="face-side" d="M44 38 L56 28 L56 34 L44 44 Z" />
      <path d="M38 16 L38 28" class="edge-soft" />
      <path d="M10 44 L22 34" class="edge-soft" />
    </template>

    <!-- 水槽鋼瓦：連續浪板，前緣三個波峰 -->
    <template v-else-if="name === 'corrugated'">
      <path
        class="face-top"
        d="M6 42 C11 30 16 30 21 42 C26 30 31 30 36 42 C41 30 46 30 51 42 L63 30 C58 18 53 18 48 30 C43 18 38 18 33 30 C28 18 23 18 18 30 Z"
      />
      <path
        class="face-side"
        d="M6 42 C11 30 16 30 21 42 C26 30 31 30 36 42 C41 30 46 30 51 42 L51 47 C46 35 41 35 36 47 C31 35 26 35 21 47 C16 35 11 35 6 47 Z"
      />
      <path d="M18 30 L18 35" class="edge-soft" />
    </template>

    <!-- 連接板：長方板加兩個螺栓孔 -->
    <template v-else>
      <path class="face-top" d="M8 40 L22 24 L56 24 L42 40 Z" />
      <path class="face-side" d="M8 40 L42 40 L42 46 L8 46 Z" />
      <path class="face-end" d="M42 40 L56 24 L56 30 L42 46 Z" />
      <ellipse class="face-hole" cx="22" cy="34" rx="4.4" ry="2.6" />
      <ellipse class="face-hole" cx="38" cy="30" rx="4.4" ry="2.6" />
      <path d="M8 40 L8 46" />
    </template>
  </svg>
</template>

<style scoped lang="scss">
/* 三階填色都從 currentColor 推導，換 text-* 時整組跟著走 */
.face-top {
  fill: color-mix(in srgb, currentColor 10%, transparent);
}

.face-side {
  fill: color-mix(in srgb, currentColor 22%, transparent);
}

.face-inner {
  fill: color-mix(in srgb, currentColor 16%, transparent);
}

.face-end {
  fill: color-mix(in srgb, currentColor 4%, transparent);
}

.face-hole {
  fill: color-mix(in srgb, currentColor 26%, transparent);
}

/* 背側的輔助線壓淡，避免跟輪廓搶視線 */
.edge-soft {
  opacity: 0.45;
}
</style>
