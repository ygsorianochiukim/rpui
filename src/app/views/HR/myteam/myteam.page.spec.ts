import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MyteamPage } from './myteam.page';

describe('MyteamPage', () => {
  let component: MyteamPage;
  let fixture: ComponentFixture<MyteamPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MyteamPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
