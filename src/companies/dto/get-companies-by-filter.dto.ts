export class RangeFilter {
  start?: number;
  end?: number;
  min?: number;
  max?: number;
}

export class CompanyFilterDto {
  dimension: 'level' | 'country' | 'city';

  filter: {
    level?: number[];
    country?: string[];
    city?: string[];
    founded_year?: RangeFilter;
    annual_revenue?: RangeFilter;
    employees?: RangeFilter;
  };
}
