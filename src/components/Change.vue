<template>
  <div class="box">
    <div class="card">
      <div class="title">
        <span @click="isShowHistory = !isShowHistory">
          {{ isShowHistory ? "HISTORY" : "HELLO" }}
        </span>
      </div>
      <div class="hash" v-if="!isShowHistory">
        Link:
        <span class="link" @click="changeUrl(toUrl)" :class="{ none: !toUrl }">
          {{ toUrl ? decodeURIComponent(toUrl) : "None" }}
        </span>
      </div>
    </div>
    <div class="card history" v-if="isShowHistory">
      <div v-for="item in history" :key="item.scheme" class="item">
        <div class="link">
          <span
            style="cursor: pointer"
            :title="decodeURIComponent(item.scheme)"
            @click="changeUrl(item.scheme)"
          >
            {{ truncateString(decodeURIComponent(item.scheme), 30) }}
          </span>
        </div>
        <span>{{ item.count }}</span>
        <span :title="formatDate(item.recently).data">
          {{ formatDate(item.recently).info }}
        </span>
      </div>
    </div>
  </div>

  <!-- <div>hello - {{ time }}</div> -->
</template>

<script>
export default {
  name: "",
  components: {},

  data() {
    return {
      time: Date.now(),
      // 从 hash 中获取到需要跳转的 URL
      toUrl: window.location.hash.substring(1),
      isShowLink: false,
      isShowHistory: false,
      history: {},
      msg: "",
    };
  },

  created() {},
  mounted() {
    this.changeUrl(this.toUrl);
    this.history = JSON.parse(localStorage.getItem("scheme_history"));
    this.history = this.sortByTime(this.history);
  },
  methods: {
    // 跳转到对应 URL
    changeUrl(url) {
      if (url) {
        window.location.replace(url);
        this.updateHistory(url);
        this.isShow = true;
      }
    },
    // 更新历史记录
    updateHistory(scheme) {
      let time = Date.now();
      let scheme_history = JSON.parse(localStorage.getItem("scheme_history"));
      // 如果没有历史记录
      if (!scheme_history) {
        const scheme_info = {
          scheme: scheme,
          count: 1,
          recently: time,
        };
        localStorage.setItem("scheme_history", JSON.stringify([scheme_info]));
      } else {
        let scheme_index = scheme_history.findIndex(
          (obj) => obj.scheme === scheme
        );
        if (scheme_index === -1) {
          // 历史记录不存在 scheme 对象，则创建新对象并添加到数组中
          scheme_history.push({ scheme: scheme, count: 1, recently: time });
        } else {
          // 更新历史记录
          scheme_history[scheme_index].count++;
          scheme_history[scheme_index].recently = time;
        }

        // 保存到 localStorage
        localStorage.setItem("scheme_history", JSON.stringify(scheme_history));
      }
    },
    // 时间格式化
    formatDate(timestamp) {
      function addLeadingZero(number) {
        if (number < 10) {
          return `0${number}`;
        } else {
          return number;
        }
      }
      const date = new Date(timestamp);
      const now = new Date();

      const year = date.getFullYear();
      const month = addLeadingZero(date.getMonth() + 1);
      const day = addLeadingZero(date.getDate());
      const hour = addLeadingZero(date.getHours());
      const min = addLeadingZero(date.getMinutes());
      const second = addLeadingZero(date.getSeconds());

      const daysAgo = Math.floor((now - date) / (1000 * 60 * 60 * 24));

      if (daysAgo === 0) {
        return {
          info: `${year}/${month}/${day} 今天`,
          data: `${year}/${month}/${day} ${hour}:${min}:${second}`,
        };
      } else if (daysAgo === 1) {
        return {
          info: `${year}/${month}/${day} 昨天`,
          data: `${year}/${month}/${day} ${hour}:${min}:${second}`,
        };
      } else {
        return {
          info: `${year}/${month}/${day} ${daysAgo}天前`,
          data: `${year}/${month}/${day} ${hour}:${min}:${second}`,
        };
      }
    },
    // 字符串截取
    truncateString(str, num) {
      // 如果字符串长度小于等于 num，直接返回原字符串
      if (str.length <= num) {
        return str;
      }
      // 否则，截取前 num 个字符，并用省略号代替多余的部分
      return str.slice(0, num) + "...";
    },
    // 按时间排序
    sortByTime(history) {
      if (history) {
        history = this.history.sort((a, b) => b.recently - a.recently);
      }
      return history;
    },
  },
  watch: {
    $route: function (to, from) {
      // console.log("URL 变化了:", to, from);
      this.toUrl = to.hash.substring(1);
      this.changeUrl(this.toUrl);
    },
  },
};
</script>

<style scoped>
.box {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.card {
  background-color: #333333;
  color: #f2f2f2;
  padding: 20px;
  margin-top: 20px;
  border-radius: 12px;
  width: 500px;
  word-wrap: break-word;
  /* border: 2px solid #6c94b8; */
}

.title {
  position: relative;
  font-size: 25px;
  font-weight: 700;
  /* margin-bottom: 20px; */
  z-index: 1;
}

.title span {
  cursor: pointer;
}

.title::after {
  position: absolute;
  content: " ";
  display: block;
  height: 15px;
  width: 80px;
  background-color: #6c94b8;
  transform: translateY(-15px) translateX(-5px);
  z-index: -1;
}

.hash {
  margin-top: 20px;
}

.link {
  display: inline;
  color: #6c94b8;
  text-decoration: underline;
}

.none {
  color: inherit;
  text-decoration: none;
  cursor: inherit;
}

.history .item {
  display: grid;
  grid-template-columns: 60% 10% 30%;
  margin-bottom: 10px;
}
</style>
