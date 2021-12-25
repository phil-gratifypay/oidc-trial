<template>
  <div ref="main" class="main" :class="{ blur: xsOnly }">
    <!-- <div ref="box" class="box" v-for="i in 10" :key="i"></div> -->

    <svg
      v-for="i in count"
      ref="blob"
      :key="i"
      :height="blob.height"
      :width="blob.width"
      class="blob"
    >
      <defs>
        <radialGradient id="spot" fx="50%" fy="20%">
          <stop offset="10%" stop-color="white" stop-opacity=".2" />
          <stop offset="70%" stop-color="white" stop-opacity="0" />
        </radialGradient>
        <pattern
          :id="`img${i}`"
          patternUnits="userSpaceOnUse"
          preserveAspectRatio="none"
          width="100%"
          height="100%"
        >
          <!-- 
          width/height: pattern size.  Higher means less color change per blob
          x: [0..-(width-blobWidth)].  For 200x200 blobs with image at 600x600 this is [0..-400]
          y: [-(blobHeight/2)..-(height-blobHeight-(blobHeight/2))]. For the above, this is [-100..-300]
         -->
          <image
            href="@/assets/blob.webp"
            :x="rand(0, -blob.imgWidth + blob.width)"
            :y="rand(-blob.height / 2, -blob.imgHeight + (3 * blob.height) / 2)"
            :width="blob.imgWidth"
            :height="blob.imgHeight"
            opacity="0.7"
            :transform="`rotate(${rand(0, 360)}, ${blob.width / 2}, ${
              blob.height / 2
            })`"
          />
        </pattern>
      </defs>
      <path
        :fill="`url(#img${i})`"
        :transform="`rotate(-45, ${blob.width / 2}, ${blob.height / 2})`"
        :d="paths[i]"
      />
      <path
        fill="url(#spot)"
        :transform="`rotate(-45, ${blob.width / 2}, ${blob.height / 2})`"
        :d="paths[i]"
      />
    </svg>
  </div>
</template>

<script>
import * as blobs2 from "blobs/v2";

export default {
  data: () => ({
    blob: {
      width: 200,
      height: 200,
      imgWidth: 360,
      imgHeight: 360,
    },
    count: 6,
    paths: [],
  }),

  computed: {
    xsOnly() {
      return this.$vuetify.breakpoint.xsOnly;
    },
  },

  mounted() {
    this.paths = Array.from({ length: this.count }, this.generateSvgPath);
  },

  methods: {
    rand(min, max) {
      // min and max included
      return Math.floor(Math.random() * (max - min + 1) + min);
    },
    generateSvgPath() {
      return blobs2.svgPath({
        seed: Math.random(),
        extraPoints: 2,
        randomness: 4,
        size: 200,
      });
    },
  },
};
</script>

<style scoped lang="scss">
.main {
  width: 100vw;
  height: 100vh;
  // background: #f0f0f0;
  position: fixed;
  overflow: hidden;
  perspective-origin: 50% 50%;
}

.blur {
  filter: blur(20px);
}

.blob {
  stroke: rgba(60, 66, 87, 0.12);
  position: absolute;
  bottom: -220px;
  // bottom: 10vh;
  transform-style: preserve-3d;
  filter: drop-shadow(0px 6px 10px rgba(60, 66, 87, 0.12));
}

@keyframes sideWays {
  0% {
    margin-left: -25px;
  }
  100% {
    margin-left: 25px;
  }
}

$duration: 40;
$leftPositions: 10%, 80%, 40%, 90%, 30%, 60%;
// $topPositions: 40%, 90%, 30%, 60%, 10%, 80%;
$blobCount: length($leftPositions);

@for $i from 1 through $blobCount {
  .blob:nth-child(#{$i}) {
    left: nth($leftPositions, $i);
    // top: nth($topPositions, $i);
    transform: scale(0.6 + 0.1 * $i); // rotate(random(360) + deg);

    animation: raise#{$i} $duration + random(20) + s linear infinite,
      sideWays random(2) + 2s ease-in-out infinite alternate;
    animation-delay: ($i - 1) * $duration/$blobCount + s;

    @keyframes raise#{$i} {
      to {
        bottom: 150vh;
        // left: random(120) * 1% - 20;
        // transform: scale(0.2 * $i - 0.6) rotate(random(360) + deg);
      }
    }
  }
}
</style>
