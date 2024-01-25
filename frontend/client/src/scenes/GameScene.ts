import * as Phaser from "phaser";
import Spline from 'typescript-cubic-spline';

function randomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

function max(a: number, b: number): number {
    return a >= b ? a : b
}

export class GameScene extends Phaser.Scene {

    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys

    private shapes!: any

    private car!: Phaser.Physics.Matter.Sprite
    private wheel1!: Phaser.Physics.Matter.Sprite
    private wheel2!: Phaser.Physics.Matter.Sprite

    private characterBody!: Phaser.Physics.Matter.Sprite
    private characterHead!: Phaser.Physics.Matter.Sprite
    
    private characterDead: boolean = false
    private gameEnd: boolean = false

    private surfacePoints: Phaser.Math.Vector2[] = []

    private carSpeed: number = 0
    private maxCarSpeed: number = 0.6
    private minCarSpeed: number = -0.6

    private width!: number
    private height!: number

    private maxFuel: number = 1
    private fuelDecreaseRate: number = this.maxFuel / 30

    private fuel: number = this.maxFuel
    private distanceRecord: number = 0
    private distance: number = 0
    private moneyCounter: number = 0

    private startPosX!: number
    private startPosY!: number

    private distanceIndicator!: Phaser.GameObjects.Text
    private moneyIndicator!: Phaser.GameObjects.Text
    private fuelIndicator!: Phaser.GameObjects.Sprite

    private moneyIcon!: Phaser.GameObjects.Image

    private backWall!: Phaser.GameObjects.Sprite

    private generatedDistance: number = 0 // px

    private lastGenerationEndX: number = 0

    private items: Phaser.Physics.Matter.Sprite[] = []

    // private esc!: any

    init() {
        this.cursors = this.input.keyboard?.createCursorKeys() as Phaser.Types.Input.Keyboard.CursorKeys
    }

    constructor() {
        super('game')
    }

    create(): void {
        // this.scene.restart();
        // this.esc = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.ESC)

        this.width = this.scale.width
        this.height = this.scale.height

        this.shapes = this.cache.json.get('shapes')

        const backWallWidth = 20
        this.backWall = this.matter.add.sprite(0, 0, 'backWall')
        this.backWall.setDisplaySize(backWallWidth, this.width)
        this.matter.body.setStatic(this.backWall.body as MatterJS.BodyType, true)
        this.matter.body.setInertia(this.backWall.body as MatterJS.BodyType, Infinity)

        this.startPosX = 300
        this.startPosY = 300

        this.characterHead = this.matter.add.sprite(0, 0, 'driverHead', undefined, { shape: this.shapes.driverHead })
        this.characterBody = this.matter.add.sprite(0, 100, 'driverBody', undefined, { shape: this.shapes.driverBody })

        this.matter.world.on(Phaser.Physics.Matter.Events.COLLISION_START, (event: Phaser.Physics.Matter.Events.CollisionStartEvent) => {
            const { pairs } = event

            pairs.forEach(pair => {
                const { bodyA, bodyB } = pair

                if (bodyA.gameObject === this.characterHead && (bodyB.gameObject != this.car && bodyB.gameObject != this.characterBody)) {
                    let collidedWithItem: boolean = false
                    this.items.forEach(item => {
                        if (bodyA.gameObject === this.characterHead && (bodyB.gameObject == item)) {
                            collidedWithItem = true
                        }
                    })

                    if (!collidedWithItem) {
                        this.characterDead = true
                    }
                }
            })
        })

        this.car = this.matter.add.sprite(this.startPosX, this.startPosY, 'car', undefined, { shape: this.shapes.carBody })
        this.wheel1 = this.matter.add.sprite(this.startPosX, this.startPosY, 'wheel', undefined, { shape: this.shapes.carWheel })
        this.wheel2 = this.matter.add.sprite(this.startPosX, this.startPosY, 'wheel', undefined, { shape: this.shapes.carWheel })

        this.characterHead.setMass(1)
        this.characterBody.setMass(1)

        const characterBodyShape = this.characterBody.body as MatterJS.BodyType
        const characterHeadShape = this.characterHead.body as MatterJS.BodyType

        // this.characterHead.setDisplayOrigin(this.characterHead.width, this.characterHead.height / 2)

        // const neckJoint = this.matter.add.joint(characterBodyShape, characterHeadShape, 100, 1);

        // Установка ограничений соединения 
        // neckJoint.stiffness = 1; // Жесткость сустава (от 0 до 1, где 1 - максимальная жесткость)
        // neckJoint.length = 0;

        const carWidth = 175
        this.car.setDisplaySize(carWidth, 1)

        function updateCarHeight(car: Phaser.Physics.Matter.Sprite) {
            car.setDisplaySize(car.displayWidth, car.displayWidth / 1.93)
        }

        function updateWheelSizes(car: Phaser.Physics.Matter.Sprite, wheel: Phaser.Physics.Matter.Sprite) {
            wheel.setDisplaySize(car.displayWidth * 0.22, car.displayWidth * 0.22)
        }

        function updateCharacterSizes(car: Phaser.Physics.Matter.Sprite, characterBody: Phaser.Physics.Matter.Sprite, characterHead: Phaser.Physics.Matter.Sprite) {
            characterBody.setDisplaySize((car.displayWidth * 0.18) * 1.71, (car.displayWidth * 0.18))
            characterHead.setDisplaySize((car.displayWidth * 0.25) * 1.07, (car.displayWidth * 0.25))
        }

        updateCarHeight(this.car)
        updateWheelSizes(this.car, this.wheel1)
        updateWheelSizes(this.car, this.wheel2)
        updateCharacterSizes(this.car, this.characterBody, this.characterHead)

        const wheelBounce = 0
        const carBounce = 0
        const wheelFriction = 0.5
        const wheelMass = 100
        const carMass = 100

        this.wheel1.setBounce(wheelBounce)
        this.wheel2.setBounce(wheelBounce)
        this.car.setBounce(carBounce)

        this.wheel1.setFriction(wheelFriction)
        this.wheel2.setFriction(wheelFriction)

        this.wheel1.setMass(wheelMass)
        this.wheel2.setMass(wheelMass)
        this.car.setMass(carMass)

        const carBody = this.car.body as MatterJS.BodyType
        const wheel1Body = this.wheel1.body as MatterJS.BodyType
        const wheel2Body = this.wheel2.body as MatterJS.BodyType

        const stiffness = 0.07
        const damping = 0.1
        const length = 2

        const spring1 = this.matter.add.spring(
            carBody,
            wheel1Body,
            length,
            stiffness,
            {
                pointA: {
                    x: this.car.displayWidth * 0.18 - 0.5 * this.car.displayWidth,
                    y: this.car.displayHeight * 0.9 - 0.5 * this.car.displayHeight
                },
                pointB: {
                    x: 0,
                    y: 0
                }
            }
        )
        
        const spring2 = this.matter.add.spring(
            carBody,
            wheel2Body,
            length,
            stiffness,
            {
                pointA: {
                    x: this.car.displayWidth * 0.816 - 0.5 * this.car.displayWidth,
                    y: this.car.displayHeight * 0.9 - 0.5 * this.car.displayHeight
                },
                pointB: {
                    x: 0,
                    y: 0
                }
            }
        )
            
        spring1.stiffness = stiffness
        spring1.damping = damping
        spring2.stiffness = stiffness
        spring2.damping = damping

        // this.matter.add.constraint(
        //     carBody,
        //     wheel1Body,
        //     2,
        //     0.1,
        //     {
        //         pointA: {
        //             x: this.car.displayWidth * 0.18 - 0.5 * this.car.displayWidth, //-163
        //             y: this.car.displayHeight * 0.9 - 0.5 * this.car.displayHeight // 70
        //         }
        //     }
        // )

        // this.matter.add.constraint(
        //     carBody,
        //     wheel2Body,
        //     2,
        //     0.1,
        //     {
        //         pointA: {
        //             x: this.car.displayWidth * 0.816 - 0.5 * this.car.displayWidth,
        //             y: this.car.displayHeight * 0.9 - 0.5 * this.car.displayHeight
        //         }
        //     }
        // )

        this.matter.add.constraint(
            carBody,
            characterBodyShape,
            0,
            0,
            {
                pointA: {
                    x: 0,
                    y: 0
                }
            }
        )

        this.matter.add.constraint(
            carBody,
            characterHeadShape,
            0,
            0,
            {
                pointA: {
                    x: -12,
                    y: -50
                }
            }
        )

        this.cameras.main.startFollow(this.car)
        this.cameras.main.setFollowOffset(-175, 100) 
        this.cameras.main.setDeadzone(0, 0) 
        this.cameras.main.setLerp(1, 1) 

        this.wheel1.setCollisionCategory(1)
        this.wheel2.setCollisionCategory(1)
        this.wheel1.setCollisionGroup(1)
        this.wheel2.setCollisionGroup(1)

        this.distance = 0
        this.distanceIndicator = this.add.text(10, 10, "", { fontFamily: "Arial", fontSize: 28, color: "#ffffff" })

        this.fuel = 1
        this.fuelIndicator = this.add.sprite(10, 45, "fuelBar")
        this.fuelIndicator.setOrigin(0, 0)

        this.moneyCounter = 0 // надо потом сюда записать начальное значение
        this.moneyIndicator = this.add.text(10, 90, "", { fontFamily: "Arial", fontSize: 28, color: "#ffffff" })
        this.moneyIcon = this.matter.add.sprite(60, 90, 'coin500', undefined, { isStatic: true })
        this.moneyIcon.setDisplaySize(40, 40)
        this.moneyIcon.setOrigin(0, 0)
    }

    update(t: number, dt: number): void {
        this.updateGameState()

        const speed = this.carSpeed
        const speedStep = 0.02

        if (!this.gameEnd) {
            if (this.cursors.left?.isDown) {
                if (this.carSpeed > this.minCarSpeed) {
                    this.carSpeed -= speedStep
                }
                this.wheel1.setAngularVelocity(this.carSpeed)
                this.wheel2.setAngularVelocity(this.carSpeed)
            } else if (this.cursors.right?.isDown) {
                if (this.carSpeed < this.maxCarSpeed) {
                    this.carSpeed += speedStep
                }
                this.wheel1.setAngularVelocity(this.carSpeed)
                this.wheel2.setAngularVelocity(this.carSpeed)
            }  else {
                this.carSpeed = (this.wheel2.getAngularVelocity() + this.wheel1.getAngularVelocity()) / 2
            }
        }

        this.updateDistance()

        this.generateMap()

        this.updateIndicatorsPositions()

        this.updateBackWallPosition()

        this.fuelIndicator.setDisplaySize(this.fuel * this.fuelIndicator.width, this.fuelIndicator.height)

        this.fuel -= this.fuelDecreaseRate * (dt / 1000)

        if (this.fuel < 0) {
            this.fuel = 0
            // console.log("no fuel")
        }

        this.characterHead.setRotation(Math.PI / 2 + this.car.rotation - Math.PI / 12)
        
        this.characterBody.setRotation(Math.PI / 2 + this.car.rotation)
    }

    updateGameState(): void {
        if ((this.characterDead || this.fuel === 0) && !this.gameEnd) {
            this.gameEnd = true
            console.log("game end.")
            this.gameOver();
        }
    }

    updateDistance(): void {
        const oneMetre = 125

        let currentDistance = Math.floor((this.car.x - this.startPosX) / oneMetre)

        if (currentDistance > this.distance) {
            this.distance = currentDistance
        }

        this.distanceIndicator.setText(this.distance.toString() + "m")
        this.moneyIndicator.setText(this.moneyCounter.toString())
    }

    updateIndicatorsPositions(): void {
        this.distanceIndicator.setScrollFactor(0, 0)
        this.fuelIndicator.setScrollFactor(0, 0)
        this.moneyIndicator.setScrollFactor(0, 0)

        this.moneyIcon.setScrollFactor(0, 0)
        this.moneyIcon.setPosition(max(this.moneyCounter.toString().length * 20, 40), this.moneyIcon.y)
    }

    updateBackWallPosition(): void {
        const backWallOffset = 400
        const newX = this.car.x - this.startPosX - backWallOffset
        const newY = this.car.y

        if (this.backWall.x < newX) {
            this.backWall.x = newX
        }

        this.backWall.y = newY
    }

    generateSurfacePoints(xStep: number, pointNumber: number, yMin: number, yMax: number, splineStep: number = 5) {
        let xArr: number[] = [];
        let yArr: number[] = [];

        if (this.surfacePoints.length > 0) {
            const pointsCount = randomInt(1, this.surfacePoints.length >= 5 ? 5 : this.surfacePoints.length)
            for (let i = 1; i <= pointsCount; i++) {
                const point = this.surfacePoints[this.surfacePoints.length - i]
                xArr.push(point.x)
                yArr.push(this.height - point.y)
            }
            this.generatedDistance -= (pointsCount - 1) * splineStep
        } else {
            xArr.push(0)
            yArr.push(0)
        }

        const xStart = xArr[xArr.length - 1]

        for (let i = 1; i < pointNumber; i++) {
            xArr.push(xStart + xStep * i)
            yArr.push(randomInt(yMin, yMax))
        }

        const spline = new Spline(xArr, yArr);

        let pointsTmp: number[][] = []
        for (let x = xStart; x <= xStart + xStep * (pointNumber - 1); x += splineStep) {
            pointsTmp.push([x, spline.at(x)])
        }

        let points: Phaser.Math.Vector2[] = pointsTmp.flatMap(([x, y]) => new Phaser.Math.Vector2(x, y));

        let result: Phaser.Math.Vector2[] = []
        for (let i = 0; i < points.length; i++) {
            result.push(new Phaser.Math.Vector2(points[i].x, this.height - points[i].y))
        }

        return result
    }

    generateSurface(): void {
        if (this.generatedDistance < this.car.x + this.width) {
            const xStart: number = this.generatedDistance
            // console.log(xStart)
            const xStep: number = 300
            const pointNumber: number = 10
            const yMin = - 10 - 10 * (this.generatedDistance / 3000) // 5000
            const yMax = 50 + 100 * (this.generatedDistance / 3000) // 5000
            const splineStep = 10

            this.lastGenerationEndX = xStart

            this.surfacePoints = this.generateSurfacePoints(xStep, pointNumber, yMin, yMax, splineStep)

            for (let i = 0; i < this.surfacePoints.length - 1; i++) {
                this.addLine(this.surfacePoints[i], this.surfacePoints[i + 1])
            }
            
            this.generatedDistance += xStep * (pointNumber - 1)
        }
    }

    generateItems(): void {
        const pointsCount = this.surfacePoints.length
        const xEnd = this.surfacePoints[pointsCount - 1].x

        const yOffset = 100

        const coinsCount: number = randomInt(2, 5)

        const minDistance: number = 50

        function findIndices(surfacePoints: Phaser.Math.Vector2[], n: number): number[] {
            const indices: number[] = [];

            for (let i = 0; i < n; i++) {
                indices.push(randomInt(0, surfacePoints.length - 1))
            }

            return indices
        }

        let coinsIndices = findIndices(this.surfacePoints, coinsCount)
        let fuelIndex: number = -1

        for (let i = 0; i < this.surfacePoints.length; i++) {
            const dif = 0.1
            const fuelStep = 40 * 135 // 1m = 135
            
            if ((this.surfacePoints[i].x / fuelStep) - Math.floor(this.surfacePoints[i].x / fuelStep) < dif &&
            Math.floor(this.surfacePoints[i].x / fuelStep) != 0) {
                fuelIndex = i
            }
        }
        
        if (this.lastGenerationEndX < xEnd) {
            for (let i = 0; i < coinsCount; i++) {
                const point = this.surfacePoints[coinsIndices[i]]
                this.addCoin(point.x, point.y - yOffset, 500)
            }

            if (fuelIndex != -1) {
                const point = this.surfacePoints[fuelIndex]
                this.addFuel(point.x, point.y - yOffset)
            }

            this.lastGenerationEndX = xEnd
        }
    }

    generateMap(): void {
        this.generateSurface()

        this.generateItems()
    }

    addLine(startPoint: Phaser.Math.Vector2, endPoint: Phaser.Math.Vector2): void {
        const massCenterX = startPoint.x;
        const massCenterY = startPoint.y;

        const lineVertices = [
            { x: startPoint.x - massCenterX, y: startPoint.y - massCenterY },
            { x: endPoint.x - massCenterX, y: endPoint.y - massCenterY },
            { x: (startPoint.x + endPoint.x) / 2 - massCenterX, y: (startPoint.y + endPoint.y) / 2 - massCenterY + 20}
        ]

        const lineBody = this.matter.add.fromVertices(massCenterX, massCenterY, lineVertices, { isStatic: true });

        const graphics = this.add.graphics();

        graphics.lineStyle(10, 0xffffff);

        graphics.lineBetween(startPoint.x, startPoint.y, endPoint.x, endPoint.y);
    }

    addItem(x: number = 0, y: number = 0, type: string, size: number): void {
        let itemShape

        const baseType = type.includes("coin") ? "coin" : type
        switch (baseType) {
            case "coin":
                itemShape = this.shapes.coin
                break
            case "fuel":
                itemShape = this.shapes.fuel
                break
            default:
                itemShape = undefined
                break
        }

        const newItem = this.matter.add.sprite(x, y, type, undefined, {
            shape: itemShape,
            isStatic: true,
            isSensor: true
        })

        newItem.setDisplaySize(size, size)

        this.matter.world.on(Phaser.Physics.Matter.Events.COLLISION_START, (event: Phaser.Physics.Matter.Events.CollisionStartEvent) => {
            const { pairs } = event

            pairs.forEach(pair => {
                const { bodyA, bodyB } = pair

                if ((bodyA.gameObject === newItem) || (bodyB.gameObject === newItem)) {
                    newItem.setCollidesWith(0)
                    newItem.setSensor(false)

                    switch (baseType) {
                        case "fuel":
                            this.fuel = 1
                            break
                        case "coin":
                            const coinValue = Number(type.slice(4, type.length))
                            this.moneyCounter += coinValue
                            break
                        default:
                            break
                    }

                    this.tweens.add({
                        targets: newItem,
                        y: newItem.y - 100,
                        alpha: 0,
                        duration: 300,
                        onComplete: () => {
                            if (newItem.body) {
                                if (newItem && !newItem.scene) {
                                    newItem.destroy()
                                }
                            }
                        }
                    })
                }
            })
        })

        this.items.push(newItem)
    }

    addCoin(x: number, y: number, value: number): void {
        const coinSize = 70
        this.addItem(x, y, "coin" + value.toString(), coinSize)
    }

    addFuel(x: number, y: number): void {
        const fuelSize = 70
        this.addItem(x, y, "fuel", fuelSize)
    }

    removeMapPart(): void {
        const offset = this.width

        // this.mapObjects.array.forEach(object => {
        //     if (object.x < this.backWall.x - offset) {
        //         delete(object)
        //         remove from list
        //     }
        // });
    }

    gameOver(): void {
        setTimeout(() => {
            if (this.gameEnd) {
                this.quitGame();
            }
        }, 2000);
    }

    quitGame(): void {
        const characterDead = this.characterDead;
        const distance = this.distance;
        const distanceRecord = this.distanceRecord;
        const money = this.moneyCounter;
        
        this.scene.start('game-over', { characterDead: characterDead, distance: distance, distanceRecord: distanceRecord, money: money });
        this.scene.remove('game');
    }
}