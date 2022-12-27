import { CalculatorService } from "./calculator.service";
import { LoggerService } from "./logger.service"
import { TestBed } from '@angular/core/testing';

describe('CalculatorService', () => {
    let calculator: CalculatorService,
        logger: any;

    beforeEach(() => {
        logger = jasmine.createSpyObj('LoggerService', ["log"]);
        TestBed.configureTestingModule({
            providers: [
                CalculatorService,
                { provide: LoggerService, useValue: logger }
            ]
        });

        calculator = TestBed.get(CalculatorService);
    });
    it('should add two numbers', () => {
        const result = calculator.add(2, 2);
        expect(result).toBe(4);
        expect(logger.log).toHaveBeenCalledTimes(1);
    });

    it('should subtract two numbers', () => {
        const result = calculator.subtract(2, 2);
        expect(result).toBe(0, 'Wrong result in Subtraction method');
    });
});