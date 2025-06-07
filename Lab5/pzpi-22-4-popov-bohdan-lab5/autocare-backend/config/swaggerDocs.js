/**
 * Swagger Annotations for API Endpoints
 */

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new user or admin
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [user, admin]
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Log in a user or admin
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Invalid email or password
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /logout:
 *   post:
 *     summary: Logout user
 *     description: Clears the authentication cookie and logs out the user.
 *     tags:
 *       - Authentication
 *     responses:
 *       200:
 *         description: Successfully logged out.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Logged out successfully
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users (admin only)
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: List of users
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /vehicles:
 *   get:
 *     summary: Get all vehicles (admin only)
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: List of all vehicles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   user_id:
 *                     type: string
 *                   make:
 *                     type: string
 *                   model:
 *                     type: string
 *                   year:
 *                     type: integer
 *                   vin_number:
 *                     type: string
 *                   tirePressure:
 *                     type: number
 *                   batteryVoltage:
 *                     type: number
 *                   brakePadThickness:
 *                     type: number
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Server error
 */


/**
 * @swagger
 * /users/{user_id}/role:
 *   put:
 *     summary: Update user role (admin only)
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: user_id
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [user, admin]
 *     responses:
 *       200:
 *         description: Role updated successfully
 *       400:
 *         description: Invalid role
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /vehicles:
 *   post:
 *     summary: Add a vehicle
 *     tags: [Vehicles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: string
 *               make:
 *                 type: string
 *               model:
 *                 type: string
 *               year:
 *                 type: integer
 *               vin_number:
 *                 type: string
 *     responses:
 *       201:
 *         description: Vehicle added successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /maintenance:
 *   post:
 *     summary: Add a maintenance record
 *     tags: [Maintenance]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               vehicle_id:
 *                 type: string
 *               maintenance_type:
 *                 type: string
 *               maintenance_date:
 *                 type: string
 *               mileage:
 *                 type: integer
 *               comments:
 *                 type: string
 *     responses:
 *       201:
 *         description: Maintenance record added successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /stats:
 *   get:
 *     summary: Get system statistics (admin only)
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: System statistics
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /vehicles/{vehicle_id}:
 *   delete:
 *     summary: Delete a vehicle
 *     tags: [Vehicles]
 *     parameters:
 *       - in: path
 *         name: vehicle_id
 *         schema:
 *           type: string
 *         required: true
 *         description: Vehicle ID
 *     responses:
 *       200:
 *         description: Vehicle deleted successfully
 *       404:
 *         description: Vehicle not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /my-vehicles:
 *   get:
 *     summary: Get user's vehicles
 *     description: Retrieve a list of vehicles belonging to the authenticated user.
 *     tags: [Vehicles]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved user's vehicles
 *       404:
 *         description: No vehicles found for the user
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */


/**
 * @swagger
 * /users/{user_id}:
 *   delete:
 *     summary: Delete a user (admin only)
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: user_id
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
