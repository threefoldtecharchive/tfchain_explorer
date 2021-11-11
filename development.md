# TFChain Explorer Docs

## Docs
- [Add New Filter](#add-new-filter)

### Add New Filter

1. Let's understand how filters work in `tfchain_explorer`  
Filters using a function called `applyFilters` which internally using a well known concept in functional programming called `compose` [More Here](https://ramdajs.com/docs/#compose).  
Basically compose is a function that takes in number of functions as inputs passing each output to the next one.  
e.g `compose(x, y, z)('input') => x(y(z('input')))`  
```ts
//  * Takes in array and returns it back after filtering it.
/**
 * @Param items { (state: S) => Array<T>}
 * Takes `vuex` state and returns back array that should be filtered.
 * 
 * @Param filters { (state: S) => F}
 * Takes `vuex` state and returns back `Object` that contains filters that should be applied to `items`.
 * 
 * 
 * @Param fns { Array<(filters: F, items: Array<T>) => Array<T>}
 * Takes in data from first two functions and returns back the filtered data.
 * 
 * @Return `applyFilters` { (state: S) => Array<T> }
 * Returns back a function that takes in `vuex` state and returns back the filtered array.
 */
export function applyFilters(
    items: (state: S) => Array<T>, 
    filters: (state: S) => F,
    ...fns: Array<(filters: F, items: Array<T>) => Array<T>>
) {
    // ...
}
```

2. Let's define new filter function that follows `applyFilters` way  

- Type 1
```ts
function newFilter1(filters: F, items: Array<T>): Array<T> {
    /* Some code to filter items based on filters */
}
```

- Type 2
```ts
function newFilter2(configs: any /* What ever you want */) {
    return (filters: F, items: Array<T>): Array<T> => {
        /* Some code to filter items based on configs & filters */
    }
}
```

3. Use new filter inside `applyFilters`  
- Type 1
```ts
applyFilters(
    (state) => state.data.nodes, // Get array needs to be filtered
    (state) => state.filters.nodes, // Get filters options
    newFilter1
)
```

- Type 2
```ts
applyFilters(
    (state) => state.data.nodes, // Get array needs to be filtered
    (state) => state.filters.nodes, // Get filters options
    newFilter2('some input')
)
```

4. Define new State for filter in `vuex` state  
Inside `src/store/state.ts` you should create helper methods to help using filter later.  
- Type
```ts
interface INewFilter {
    /* define what you need here */
    /* eg. */
    value: string;
}
```

- Initial value creator
```ts
const createNewFilter = () => ({ value: "" });
```

- Add type to `IState` interface  
```ts
/* eg. */
export interface IState {
  filters: {
    nodes: {
        propName: INewFilter
    };
    // ...
  };
  // ...
}
```

- Add value in `vuex` state
```ts
export default {
  filters: {
    nodes: {
        propName: createNewFilter()
    },
    // ...
  },
  // ...
} as IState;
```

5. Add Ui component to display your filter however you want examples.
- `src/components/InFilter.vue`
- `src/components/ComparisonFilter.vue`
- `src/components/ConditionFilter.vue`
- `src/components/RangeFilter.vue`