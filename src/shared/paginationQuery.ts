import { SelectQueryBuilder } from 'typeorm';

export interface SearchByInterface {
  [key: string]: string | string[];
}

interface PaginationQueryProps {
  query: SelectQueryBuilder<any>;
  searchBy: SearchByInterface;
  inputData: any | undefined;
  applySkipTake?: boolean;
}

const paginationQuery = ({
  query,
  searchBy,
  inputData,
  applySkipTake = true,
}: PaginationQueryProps) => {
  // add search fields to query
  if (inputData && inputData.q) {
    Object.entries(inputData.q).map(([key, value]) => {
      if (value && key in searchBy) {
        let whereCondition: string = '';

        if (typeof value === 'number') {
          // input is number
          if (Array.isArray(searchBy[key])) {
            // search in multiple fields
            const whereConditionArr: string[] = [];
            (searchBy[key] as string[]).forEach(oneCondition => {
              whereConditionArr.push(`${oneCondition} = :q${key}`);
            });
            whereCondition = `(${whereConditionArr.join(' OR ')})`;
          } else {
            // search in one field
            whereCondition = `${searchBy[key]} = :q${key}`;
          }

          // apply where condition
          query.andWhere(`${whereCondition}`, {
            [`q${key}`]: `${value}`,
          });
        } else {
          // input is string
          if (Array.isArray(searchBy[key])) {
            // search in multiple fields
            const whereConditionArr: string[] = [];
            (searchBy[key] as string[]).forEach(oneCondition => {
              whereConditionArr.push(`${oneCondition} LIKE :q${key}`);
            });
            whereCondition = `(${whereConditionArr.join(' OR ')})`;
          } else {
            // search in one field
            whereCondition = `${searchBy[key]} LIKE :q${key}`;
          }

          // apply where condition
          query.andWhere(`${whereCondition}`, {
            [`q${key}`]: `%${value}%`,
          });
        }
      }
    });
  }

  // sort by
  applySortBy(query, inputData);

  // limit, offset
  applyLimit(query, inputData, applySkipTake);

  return query;
};

export const applySortBy = (
  query: SelectQueryBuilder<any>,
  inputData: any | undefined
) => {
  // sort by
  if (inputData && inputData.sortBy) {
    inputData.sortBy.split('|').forEach((sortBy: string) => {
      query.addOrderBy(sortBy, inputData.sortDesc ? 'DESC' : 'ASC');
    });
  }
};

const applyLimit = (
  query: SelectQueryBuilder<any>,
  inputData: any | undefined,
  applySkipTake: boolean = true
) => {
  // page and number of results
  if (inputData && inputData.page && inputData.limit) {
    const skip = ((inputData.page as number) - 1) * (inputData.limit as number);
    const take = inputData.limit;

    if (applySkipTake) {
      // limit and offset can't be used as it doesn't remove duplicates
      query.skip(skip);
      query.take(take);
    } else {
      query.offset(skip);
      query.limit(take);
    }
  }
};

export default paginationQuery;
