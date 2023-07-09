<template>
  <div class="box">
    <!--  标题和创建链接卡片  -->
    <div id="operate-card" class="card" :style="styles">
      <div class="title">
        <span @click="isShowHistory = !isShowHistory">
          {{ isShowHistory ? "HISTORY" : title }}
        </span>
      </div>

      <div v-if="!showCloseMsg">
        <div v-if="!isShowHistory">
          <!-- 输入框 -->
          <input
            id="url"
            ref="urlInput"
            v-model="url"
            placeholder="需要跳转的地址"
            @keydown.enter="copy"
          />
          <!-- 复制按钮 -->
          <button id="copy" class="wd-button" @:click="copy">
            {{ copyText }}
          </button>
          <!-- 展示链接 -->
          <div class="hash" v-if="url">
            <span class="link" @click="gotoUrl(toUrl)">
              {{ decodeURIComponent(toUrl) }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <div id="copied-card">
      <div
        class="card"
        v-for="item in urlList"
        :key="item"
        v-if="!isShowHistory"
      >
        <span class="link" @click="gotoUrl(item)">
          {{ decodeURIComponent(item) }}
        </span>
      </div>
    </div>
    <!-- 链接跳转后提示信息卡片  -->
    <div class="card closeMsg" v-show="showCloseMsg">
      <span> {{ "本页面将在 " + countDown + " 秒后自动关闭" }}</span>
      <br />
      <span> 需要创建链接请访问 </span>
      <a class="link" @click="changeUrl(origin)">{{ origin }}</a>
    </div>
    <!-- 本地历史记录卡片 -->
    <div class="card" id="history" v-if="isShowHistory">
      <div v-for="item in history" :key="item.scheme" class="item">
        <div class="link">
          <span
            style="cursor: pointer"
            :title="decodeURIComponent(item.scheme)"
            @click="toHistoryUrl(item.scheme)"
          >
            {{ truncateString(decodeURIComponent(item.scheme), 30) }}
          </span>
        </div>
        <span>{{ item.count }}</span>
        <span :title="formatDate(item.recently).data">
          {{ formatDate(item.recently).info }}
        </span>
      </div>

      <button id="invalid-button" class="wd-button" @:click="invalidHistory">
        清空记录
      </button>
      <span
        >所有记录均存放在本地，源代码地址：<a
          href="https://github.com/weepwood/weepwood-scheme-to-url"
          >GitHub</a
        ></span
      >
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
      url: "",
      urlList: [],
      // 从 hash 中获取到需要跳转的 URL
      toUrl: window.location.hash.substring(1),
      isShowLink: false,
      isShowHistory: false,
      history: {},
      msg: "",
      copyUrl: "",
      copyText: "Copy",
      countDown: "5",
      showCloseMsg: false,
      origin: window.location.origin,
      title: "HELLO",
      topFlag: false,
    };
  },

  created() {},
  mounted() {
    this.changeUrl(this.toUrl);
    this.history = JSON.parse(localStorage.getItem("scheme_history"));
    this.history = this.sortByTime(this.history);
    // 输入框自动获取焦点
    this.$nextTick(() => {
      this.$refs.urlInput.focus();
    });
  },
  methods: {
    // 跳转到对应 URL
    changeUrl(url) {
      if (url) {
        window.location.replace(url);
        this.updateHistory(url);
      }
      if (window.location.hash.substring(1)) {
        this.showCloseMsg = true;
        this.title = "GOTO";
        // 关闭信息
        for (let i = 0; i < 5; i++) {
          setTimeout(() => {
            this.countDown = 5 - i;
          }, i * 1000);
        }
        setTimeout(() => {
          window.close();
        }, 5000);
      }
    },
    // 展示链接跳转并复制
    gotoUrl(url) {
      navigator.clipboard.writeText(url);
      window.open(url);
    },

    // 历史记录链接跳转并复制
    toHistoryUrl(url) {
      navigator.clipboard.writeText(window.location.origin + "/#" + url);
      window.open(url);
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
    // 清空历史记录
    invalidHistory() {
      localStorage.clear();
      location.reload();
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
    copy() {
      navigator.clipboard.writeText(this.copyUrl).then(() => {
        this.copyText = "Success";
        // 将 url 内容保存到 url List 中
        this.urlList.unshift(window.location.origin + "/#" + this.url);
        // 清空 url 内容
        this.url = "";
        setTimeout(() => {
          this.copyText = "Copy";
        }, 1000);
      });
    },
  },
  watch: {
    $route: function (to) {
      this.toUrl = to.hash.substring(1);
      this.changeUrl(this.toUrl);
    },
  },
  computed: {
    toUrl() {
      this.copyUrl = window.location.origin + "/#" + this.url;
      // 编码 URL 中的特殊字符
      this.copyUrl = encodeURI(this.copyUrl);
      return this.copyUrl;
    },
    styles() {
      if (this.topFlag === true || this.url !== "") {
        this.topFlag = true;
        return {
          marginTop: 20 + "px",
        };
      }
    },
  },
};
</script>

<style scoped>
.box {
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* 垂直居中 */
#operate-card {
  margin-top: calc((100vh - 135px) * 0.5);
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
  cursor: pointer;
}

.item {
  display: grid;
  grid-template-columns: 60% 10% 30%;
  margin-bottom: 15px;
}

#url {
  background: #fff;
  border: 2px solid #dfe1e5;
  box-shadow: none;
  border-radius: 4px;
  margin-top: 25px;
  padding: 6px 15px;
  font-size: 16px;
  line-height: 16px;
  width: 65%;
  transform: translateX(-5px);
}

#url:focus {
  border-color: #6c94b8;
  outline: none;
}

.wd-button {
  background: #6c94b8;
  color: white;
  border: 1px solid #6c94b8;
  width: 25%;
  box-shadow: none;
  margin-left: 3%;
  padding: 8px 24px;
  border-radius: 4px;
  height: auto;
  cursor: pointer;
  font-size: 16px;
}

#invalid-button {
  margin: auto;
  margin-right: 10px;
}

.closeMsg {
  line-height: 25px;
  cursor: pointer;
}
</style>
