/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  AgnosticBreadcrumb,
  AgnosticCategoryTree,
  AgnosticFacet,
  AgnosticGroupedFacet,
  AgnosticPagination,
  AgnosticSort,
  FacetsGetters
} from '@vue-storefront/core';
import { Category, Product } from '@vue-storefront/odoo-api';
import { FacetResultsData, SearchData } from '../types';
import CategoryGetters from './categoryGetters';
const getAll = (
  searchData: SearchData,
  criteria?: string[]
): AgnosticFacet[] => [];

const isNumeric = (num) => !isNaN(num);

const getGrouped = (
  searchData: SearchData,
  criteria?: string[]
): AgnosticGroupedFacet[] => {
  if (!searchData?.data?.attributes) return [];

  const data = [];

  searchData.data.attributes.forEach(item => {
    const current = data.find(itemData => itemData.atributeName === item.attribute?.name);

    if (!current) {
      data.push({
        id: String(item.attribute.id),
        label: item.attribute?.name,
        atributeName: item.attribute?.name,
        type: item.displayType,
        count: 0,
        options: []
      });
    }

    data.find(itemData => itemData.atributeName === item.attribute?.name).options.push({
      id: String(item.search),
      value: item.id,
      label: item.name,
      metadata: item.search,
      htmlColor: item.htmlColor
    });

  });

  return data;
};

const getSortOptions = (searchData: SearchData): AgnosticSort => ({
  options: [
    {
      id: 'list_price desc',
      value: 'price,DESC',
      attrName: 'Price: High to Low',
      type: ''
    },
    {
      id: 'list_price asc',
      value: 'price,ASC',
      attrName: 'Price: Low to High',
      type: ''
    },
    { id: 'name asc', value: 'name,ASC', attrName: 'Name: A to Z', type: '' },
    { id: 'name desc', value: 'name,DESC', attrName: 'Name: Z to A', type: '' }
  ],
  selected: searchData.input.sort || 'name asc'
});

const getCategoryTree = (searchData: SearchData): AgnosticCategoryTree => {
  if (!searchData?.data?.category) {
    return { items: [], label: '', isCurrent: false };
  }

  const category = searchData.data.category;
  let parentCategory: Category = category;

  if (!category?.childs && category?.parent) {
    parentCategory = category?.parent?.parent;
  }

  return CategoryGetters.getTree(parentCategory);
};

const getCategory = (searchData: SearchData): Category => searchData?.data?.category;

const getProducts = (searchData: SearchData): Product[] => {
  if (!searchData?.data?.products || searchData?.data?.products?.length === 0) {
    return [];
  }

  return searchData.data.products;
};

const getPagination = (searchData: SearchData): AgnosticPagination => {
  const itemsPerPage = searchData.input?.pageSize || 12;

  return {
    currentPage: 1,
    totalPages: Math.ceil(searchData.data?.totalProducts / itemsPerPage) || 1,
    totalItems: searchData.data?.totalProducts,
    itemsPerPage,
    pageOptions: [5, 12, 15, 20]
  };
};

const getBreadcrumbsByProduct = (product: Product): AgnosticBreadcrumb[] => {
  const category = product.categories?.filter((cat) => cat?.name !== 'All');
  const breadcrumbs = [{ text: 'Home', link: '/' }];

  if (!category) {
    return [];
  }
  breadcrumbs.push({
    text: category[0]?.name,
    link: category[0]?.slug
  });

  return breadcrumbs || [];
};

const getBreadcrumbs = ({ input }: SearchData): AgnosticBreadcrumb[] => {
  const breadcrumbs = [{ text: 'Home', link: '/' }];

  breadcrumbs.push({
    text: input.currentRootCategory?.name,
    link: input.currentRootCategory?.slug
  });

  if (input.params.slug_2 && !isNumeric(input.params.slug_2)) {
    const splited = input.params.slug_2.split('-');
    breadcrumbs.push({ text: splited[2], link: '' });
  }

  return breadcrumbs;
};

const facetGetters: FacetsGetters<FacetResultsData, any> = {
  getBreadcrumbsByProduct,
  getSortOptions,
  getGrouped,
  getAll,
  getProducts,
  getCategoryTree,
  getBreadcrumbs,
  getPagination
};

export default facetGetters;
