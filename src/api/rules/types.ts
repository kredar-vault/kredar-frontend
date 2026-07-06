export interface RuleItem {
  id: string;
  trigger: string;
  action: string;
  thresholdNaira?: number;
  priority: number;
}

export interface CreateRulePayload {
  trigger: string;
  action: string;
  thresholdNaira?: number;
  priority: number;
}
