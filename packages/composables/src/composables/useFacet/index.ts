import { Context, useFacetFactory, FacetSearchResult } from '@vue-storefront/core';

const factoryParams = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  search: async (context: Context, params: FacetSearchResult<any>) => {

    const categories = await context.$odoo.api.getCategory({ ...params, topCategory: false });
    const products = await context.$odoo.api.getProductTemplatesPublished({ ...params.input });
    return {
      categories,
      products: products.result.products,
      attributes: products.result.attributes,
      totalProducts: products.result.product_count
    };
  }
};

export default useFacetFactory<any>(factoryParams);
