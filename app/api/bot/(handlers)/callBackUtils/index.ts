import { planHandler } from './planHandler';
import { startPlanUsingTemplateHandler } from './startUsingTemplate';
import { templateHandler } from './templateHandler';

const DynamicCallBackHandlers = {
  plan: planHandler,
  startUsingTemplate: startPlanUsingTemplateHandler,
  template: templateHandler,
};

export default DynamicCallBackHandlers;
