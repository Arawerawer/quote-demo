<script setup lang="ts">
const simplePage = ref(1)
const currentPage = ref(1)
const pageSize = ref(10)

const rows = [
  {
    id: 'CMP-001',
    name: '輸入欄位',
    category: '表單',
    updatedAt: '2026/08/08 10:00',
    status: '已發布',
    version: 'v1.2',
  },
  {
    id: 'CMP-002',
    name: '彈出視窗',
    category: '回饋',
    updatedAt: '2026/08/08 14:00',
    status: '審核中',
    version: 'v1.1',
  },
  {
    id: 'CMP-003',
    name: '狀態標籤',
    category: '內容',
    updatedAt: '2026/08/09 11:30',
    status: '已發布',
    version: 'v1.0',
  },
]

const usage = `<UITable :hide-vertical-borders="false">
  <table>
    <thead>
      <tr>
        <th>元件名稱</th>
        <th>分類</th>
        <th>狀態</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>輸入欄位</td>
        <td>表單</td>
        <td>已發布</td>
      </tr>
    </tbody>
  </table>
</UITable>`
</script>

<template>
  <ShowcasePage
    title="表格"
    description="使用原生 table 結構，透過 UITable 統一處理框線、間距、色彩與橫向捲動。"
  >
    <ShowcaseSection
      title="完整框線表格"
      component-name="UITable"
      description="預設包含橫向與垂直欄位框線。包裝器內可直接使用 table、thead、tbody、tfoot 等原生標籤；窄螢幕會提供橫向捲動。"
      :usage="usage"
    >
      <UITable>
        <table>
          <caption>
            最近更新元件
          </caption>
          <thead>
            <tr>
              <th>元件編號</th>
              <th>元件名稱</th>
              <th>分類</th>
              <th>更新時間</th>
              <th data-align="center">狀態</th>
              <th data-align="right">版本</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in rows" :key="row.id">
              <td>{{ row.id }}</td>
              <td>{{ row.name }}</td>
              <td>{{ row.category }}</td>
              <td>{{ row.updatedAt }}</td>
              <td data-align="center">{{ row.status }}</td>
              <td data-align="right">{{ row.version }}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colspan="5" data-align="right">已發布</td>
              <td data-align="right">v1.x</td>
            </tr>
          </tfoot>
        </table>
      </UITable>
    </ShowcaseSection>

    <ShowcaseSection
      title="隱藏垂直框線"
      component-name="UITable"
      description="設定 hide-vertical-borders 後，只保留橫向分隔線，適合內容較多、希望畫面更輕盈的表格。"
      usage="<UITable hide-vertical-borders><table>...</table></UITable>"
    >
      <UITable hide-vertical-borders>
        <table>
          <thead>
            <tr>
              <th>元件名稱</th>
              <th>分類</th>
              <th>更新時間</th>
              <th data-align="center">狀態</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in rows" :key="row.id">
              <td>{{ row.name }}</td>
              <td>{{ row.category }}</td>
              <td>{{ row.updatedAt }}</td>
              <td data-align="center">{{ row.status }}</td>
            </tr>
          </tbody>
        </table>
      </UITable>
    </ShowcaseSection>

    <ShowcaseSection
      title="表格換頁"
      component-name="UITablePaginationInfo + UITablePagination"
      description="使用 v-model 控制目前頁碼，可依需求選擇簡易或進階的換頁控制。"
      usage='<UITablePaginationInfo
  v-model="pageSize"
  :current-page="currentPage"
  :total-pages="12"
  :total-items="123"
  :page-size-options="[10, 20, 50, 100]"
/>

<UITablePagination v-model="simplePage" :total-pages="6" />
<UITablePagination v-model="currentPage" :total-pages="12" show-page-jump :page-jump-size="5" />'
    >
      <div class="grid gap-6">
        <UITablePaginationInfo
          v-model="pageSize"
          :current-page="currentPage"
          :total-pages="12"
          :total-items="123"
        />

        <div class="grid gap-3">
          <strong class="text-brand-700 text-sm">簡易版</strong>
          <div class="flex flex-wrap items-center justify-between gap-4">
            <UITablePagination v-model="simplePage" :total-pages="6" />
            <span class="text-brand-600 text-sm font-bold"
              >目前第 {{ simplePage }} 頁</span
            >
          </div>
        </div>

        <div class="grid gap-3">
          <strong class="text-brand-700 text-sm">進階版</strong>
          <div class="flex flex-wrap items-center justify-between gap-4">
            <UITablePagination
              v-model="currentPage"
              :total-pages="12"
              show-page-jump
              :page-jump-size="5"
            />
            <span class="text-brand-600 text-sm font-bold"
              >目前第 {{ currentPage }} 頁</span
            >
          </div>
        </div>
      </div>
    </ShowcaseSection>
  </ShowcasePage>
</template>
