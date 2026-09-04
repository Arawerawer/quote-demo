<script setup lang="ts">
const pageSize = ref(10)
const currentPage = ref(1)
const filterExpanded = ref(true)
</script>

<template>
  <div class="mx-auto w-[min(100%,1180px)] p-6 max-md:p-4">
    <UIPageHeader
      title="清單表格範例頁"
      description="這是一個清單表格範例頁。"
      class="mb-4"
    >
      <UIFormButtonGroup :sm="0" :md="2">
        <UIFormButton text="新增" icon="Plus" variant="warning" />
        <UIFormButton text="匯入" icon="Import" variant="secondary" />
      </UIFormButtonGroup>
    </UIPageHeader>

    <UIPageContent class="flex flex-col">
      <div class="mb-4 flex justify-between">
        <UITablePaginationInfo
          v-model="pageSize"
          :current-page="currentPage"
          :total-pages="12"
          :total-items="123"
        />

        <div class="flex max-w-100 gap-2">
          <UIFormInput placeholder="請輸入關鍵字" />
          <UIFormButton icon="Search" iconOnly />
          <UIFormButton
            icon="Filter"
            iconOnly
            variant="secondary"
            :aria-expanded="filterExpanded"
            aria-controls="table-filter"
            @click="filterExpanded = !filterExpanded"
          />
        </div>
      </div>
      <UITableFilter v-model="filterExpanded">
        <div class="grid grid-cols-3 gap-3">
          <UIFormGroup label="關鍵字" row>
            <UIFormInput placeholder="請輸入關鍵字" />
          </UIFormGroup>

          <UIFormGroup label="分類" row>
            <UIFormSelect
              :options="[
                { value: 'category1', label: '分類1' },
                { value: 'category2', label: '分類2' },
                { value: 'category3', label: '分類3' },
              ]"
            />
          </UIFormGroup>

          <div class="flex justify-end">
            <UIFormButton text="搜尋" class="w-fit" />
          </div>
        </div>
      </UITableFilter>
      <UITable>
        <table>
          <thead>
            <tr>
              <th>元件編號</th>
              <th>元件名稱</th>
              <th>分類</th>
              <th>更新時間</th>
              <th data-align="center">狀態</th>
              <th data-align="center" class="w-1">動作</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>元件名稱 1</td>
              <td>分類 1</td>
              <td>2024-06-05</td>
              <td data-align="center">啟用</td>
              <td data-align="center" class="flex justify-center gap-1">
                <UIFormButton text="編輯" size="sm" />
                <UIFormButton text="刪除" size="sm" variant="danger" />
              </td>
            </tr>
            <tr>
              <td>2</td>
              <td>元件名稱 2</td>
              <td>分類 2</td>
              <td>2024-06-05</td>
              <td data-align="center">啟用</td>
              <td data-align="center" class="flex justify-center gap-1">
                <UIFormButton text="編輯" size="sm" />
                <UIFormButton text="刪除" size="sm" variant="danger" />
              </td>
            </tr>
          </tbody>
        </table>
      </UITable>
    </UIPageContent>

    <UITablePagination :total-pages="5" class="m-auto mt-5 w-fit" />
  </div>
</template>
