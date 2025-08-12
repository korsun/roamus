import { Router } from 'express';

import { buildRoute } from '@/controllers/routing';

const router = Router();

router.route('/routing').post(buildRoute);
router.get('/health', (_req, res) => res.status(200).end());

export const routes = router;
