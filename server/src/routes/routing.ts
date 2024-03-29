import { Router } from 'express';

import { buildRoute } from '@/controllers/routing';

const router = Router();

router.route('/routing').post(buildRoute);

export const routing = router;
