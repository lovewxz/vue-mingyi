<template lang="html">
  <scroll class="doctor-list" :data="doctors" :pullUp="pullUp" @scrollEnd="scrollToEnd" ref="doctor">
    <ul>
      <li class="doctor-item" v-for="item in doctors" :key="item._id" @click="goUrl(item)">
         <div class="head-img">
           <img :src="`${imgCDN}/${item.avatar}`" alt="">
         </div>
         <div class="doctor-profile">
           <h2 class="doctor-name">{{item.realname}}</h2>
           <p class="doctor-job">{{item.title}}</p>
           <div class="doctor-tag">
              <div class="tag-item">胸部整形</div>
              <div class="tag-item">自体脂肪整形</div>
              <div class="tag-item">眼部整形</div>
           </div>
         </div>
      </li>
      <div class="loading-wrapper">
        <loading title="" v-show="hasMore"></loading>
      </div>
    </ul>
  </scroll>
</template>

<script>
import config from '@/config'
import Scroll from '@/base/scroll/scroll'
import Loading from '@/base/loading/loading'
import { mapGetters } from 'vuex'

export default {
  props: {
    isFavor: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      limit: 10,
      page: 1,
      doctors: [],
      total: 0,
      hasMore: true,
      pullUp: true
    }
  },
  computed: {
    ...mapGetters(['user', 'favorDoctor'])
  },
  methods: {
    scrollToEnd() {
      if (!this.hasMore) {
        return
      }
      this.page = this.page + 1
      this.getDoctorList()
    },
    getDoctorList() {
      this.$store
        .dispatch('getDoctorList', { limit: this.limit, page: this.page })
        .then(res => {
          res = res.data
          if (res.success) {
            this.doctors = this.doctors.concat(res.data.list)
            this.total = res.data.total
            this._checkMore(this.doctors)
          }
        })
    },
    getFavorDoctorList() {
      this.$store
        .dispatch('getFavorDoctorList', {
          limit: this.limit,
          page: this.page,
          _id: this.user._id
        })
        .then(res => {
          res = res.data
          if (res.success) {
            this.doctors = this.doctors.concat(res.data.list)
            this.total = res.data.total
            this._checkMore(this.doctors)
          }
        })
    },
    goUrl(item) {
      this.$router.push(`/doctor/${item._id}`)
    },
    _checkMore(data) {
      if (data.length >= this.total) {
        this.hasMore = false
      }
    },
    refresh() {
      setTimeout(() => {
        this.$refs.doctor.refresh()
      }, 20)
    }
  },
  created() {
    this.imgCDN = config.imgCDN
    this.isFavor ? this.getFavorDoctorList() : this.getDoctorList()
  },
  watch: {
    favorDoctor(newVal) {
      if (this.isFavor && newVal) {
        this.doctors = []
        this.getFavorDoctorList()
      }
    }
  },
  components: {
    Scroll,
    Loading
  }
}
</script>

<style lang="scss" scoped>
.doctor-list {
  height: 100%;
  overflow: hidden;
  ul {
    .doctor-item {
      padding: 22px 15px 10px;
      display: flex;
      align-items: center;
      border-bottom: 1px solid #f0f0f0;
      &:nth-last-child(2) {
        border-bottom: none;
      }
      .head-img {
        width: 66px;
        height: 66px;
        position: relative;
        &::before {
          content: '';
          position: absolute;
          width: 16px;
          height: 16px;
          right: 0;
          bottom: 0;
          background-size: 100% 100%;
          background-image: url('./icon.png');
        }
        img {
          border-radius: 50%;
        }
      }
      .doctor-profile {
        margin-left: 20px;
        .doctor-name {
          font-size: 14px;
          color: #000;
        }
        .doctor-job {
          font-size: 12px;
          color: #666;
          margin: 7px 0;
        }
        .doctor-tag {
          font-size: 0;
          .tag-item {
            height: 22px;
            line-height: 22px;
            font-size: 12px;
            text-align: center;
            border-radius: 5px;
            background: #f5f5f5;
            padding: 0 8px;
            display: inline-block;
            margin-right: 5px;
            margin-bottom: 5px;
          }
        }
      }
    }
  }
}
.loading-wrapper {
  width: 24px;
  height: 24px;
  position: absolute;
  left: 50%;
  transform: translate(-50%);
}
</style>
