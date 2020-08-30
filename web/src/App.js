// Copyright 2020 The casbin Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import React, {Component} from 'react';
import './App.css';
import * as Setting from "./Setting";
import {DownOutlined, LogoutOutlined, SettingOutlined} from '@ant-design/icons';
import {Avatar, BackTop, Dropdown, Layout, Menu} from 'antd';
import {Switch, Route, withRouter, Redirect} from 'react-router-dom';
import {GithubLoginButton} from "react-social-login-buttons";
import * as AccountBackend from "./backend/AccountBackend";
import ProgramListPage from "./ProgramListPage";
import ProgramEditPage from "./ProgramEditPage";
import StudentListPage from "./StudentListPage";
import StudentEditPage from "./StudentEditPage";
import AccountPage from "./AccountPage";
import RoundListPage from "./RoundListPage";
import RoundEditPage from "./RoundEditPage";
import ReportListPage from "./ReportListPage";
import ReportEditPage from "./ReportEditPage";
import RankingPage from "./RankingPage";
import CallbackBox from "./AuthBox";

const { Header, Footer } = Layout;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      classes: props,
      selectedMenuKey: 0,
      account: undefined,
    };

    Setting.initServerUrl();
    Setting.initFullClientUrl();
  }

  componentWillMount() {
    this.updateMenuKey();
    this.getAccount();
  }

  updateMenuKey() {
    // eslint-disable-next-line no-restricted-globals
    const uri = location.pathname;
    if (uri === '/') {
      this.setState({ selectedMenuKey: 0 });
    } else if (uri.includes('students')) {
      this.setState({ selectedMenuKey: 1 });
    } else if (uri.includes('programs')) {
      this.setState({ selectedMenuKey: 2 });
    } else if (uri.includes('rounds')) {
      this.setState({ selectedMenuKey: 3 });
    } else if (uri.includes('reports')) {
      this.setState({ selectedMenuKey: 4 });
    } else {
      this.setState({ selectedMenuKey: -1 });
    }
  }

  onLogined() {
    this.getAccount();
  }

  onUpdateAccount(account) {
    this.setState({
      account: account
    });
  }

  getAccount() {
    AccountBackend.getAccount()
      .then((res) => {
        const account = Setting.parseJson(res.data);
        this.setState({
          account: account,
        });
      });
  }

  logout() {
    this.setState({
      expired: false,
      submitted: false,
    });

    AccountBackend.logout()
      .then((res) => {
        if (res.status === 'ok') {
          this.setState({
            account: null
          });

          Setting.showMessage("success", `Successfully logged out, redirected to homepage`);

          Setting.goToLink("/");
        } else {
          Setting.showMessage("error", `Logout failed: ${res.msg}`);
        }
      });
  }

  handleRightDropdownClick(e) {
    if (e.key === '0') {
      this.props.history.push(`/account`);
    } else if (e.key === '1') {
      this.logout();
    }
  }

  renderRightDropdown() {
    const menu = (
      <Menu onClick={this.handleRightDropdownClick.bind(this)}>
        <Menu.Item key='0'>
          <SettingOutlined />
          My Account
        </Menu.Item>
        <Menu.Item key='1'>
          <LogoutOutlined />
          Logout
        </Menu.Item>
      </Menu>
    );

    return (
      <Dropdown key="4" overlay={menu} >
        <a className="ant-dropdown-link" href="#" style={{float: 'right'}}>
          <Avatar style={{ backgroundColor: Setting.getAvatarColor(this.state.account.name), verticalAlign: 'middle' }} size="large">
            {Setting.getShortName(this.state.account.name)}
          </Avatar>
          &nbsp;
          &nbsp;
          {Setting.isMobile() ? null : Setting.getShortName(this.state.account.name)} &nbsp; <DownOutlined />
          &nbsp;
          &nbsp;
          &nbsp;
        </a>
      </Dropdown>
    )
  }

  renderAccount() {
    let res = [];

    if (this.state.account === undefined) {
      return null;
    } else if (this.state.account === null) {
      res.push(
        <div key="100" style={{float: 'right', height: "64px", marginRight: "10px"}}>
          <GithubLoginButton style={{marginTop: "12px", fontSize: "14px"}} size={40} onClick={() => Setting.getGithubAuthCode("signup")} />
          {/*<a href="/login"></a>*/}
        </div>
      );
    } else {
      res.push(this.renderRightDropdown());
    }

    return res;
  }

  renderMenu() {
    let res = [];

    // if (this.state.account === null || this.state.account === undefined) {
    //   return [];
    // }

    res.push(
      <Menu.Item key="0">
        <a href="/">
          Home
        </a>
      </Menu.Item>
    );
    res.push(
      <Menu.Item key="1">
        <a href="/students">
          Students
        </a>
      </Menu.Item>
    );
    res.push(
      <Menu.Item key="2">
        <a href="/programs">
          Programs
        </a>
      </Menu.Item>
    );
    res.push(
      <Menu.Item key="3">
        <a href="/rounds">
          Rounds
        </a>
      </Menu.Item>
    );
    res.push(
      <Menu.Item key="4">
        <a href="/reports">
          Reports
        </a>
      </Menu.Item>
    );

    return res;
  }

  renderHomeIfLogined(component) {
    if (this.state.account !== null && this.state.account !== undefined) {
      return <Redirect to='/' />
    } else {
      return component;
    }
  }

  renderLoginIfNotLogined(component) {
    if (this.state.account === null) {
      return <Redirect to='/' />
    } else if (this.state.account === undefined) {
      return null;
    }
    else {
      return component;
    }
  }

  isStartPages() {
    return window.location.pathname.startsWith('/login') ||
      window.location.pathname.startsWith('/register') ||
      window.location.pathname === '/';
  }

  renderContent() {
    return (
      <div>
        <Header style={{ padding: '0', marginBottom: '3px'}}>
          {
            Setting.isMobile() ? null : <a className="logo" href={"/"} />
          }
          <Menu
            // theme="dark"
            mode={(Setting.isMobile() && this.isStartPages()) ? "inline" : "horizontal"}
            defaultSelectedKeys={[`${this.state.selectedMenuKey}`]}
            style={{ lineHeight: '64px' }}
          >
            {
              this.renderMenu()
            }
            {
              this.renderAccount()
            }
          </Menu>
        </Header>
        <Switch>
          <Route exact path="/" render={(props) => <RankingPage account={this.state.account} {...props} />}/>
          <Route exact path="/programs/:programName/ranking" render={(props) => <RankingPage account={this.state.account} {...props} />}/>
          <Route exact path="/callback/:authType/:addition" component={CallbackBox}/>
          <Route exact path="/account" render={(props) => this.renderLoginIfNotLogined(<AccountPage account={this.state.account} {...props} />)}/>
          <Route exact path="/user/:username" render={(props) => <AccountPage account={this.state.account} {...props} />}/>
          <Route exact path="/students" render={(props) => <StudentListPage account={this.state.account} {...props} />}/>
          <Route exact path="/students/:studentName" render={(props) => <StudentEditPage account={this.state.account} {...props} />}/>
          <Route exact path="/programs" render={(props) => <ProgramListPage account={this.state.account} {...props} />}/>
          <Route exact path="/programs/:programName" render={(props) => <ProgramEditPage account={this.state.account} {...props} />}/>
          <Route exact path="/rounds" render={(props) => <RoundListPage account={this.state.account} {...props} />}/>
          <Route exact path="/rounds/:roundName" render={(props) => <RoundEditPage account={this.state.account} {...props} />}/>
          <Route exact path="/reports" render={(props) => <ReportListPage account={this.state.account} {...props} />}/>
          <Route exact path="/reports/:reportName" render={(props) => <ReportEditPage account={this.state.account} {...props} />}/>
        </Switch>
      </div>
    )
  }

  renderFooter() {
    // How to keep your footer where it belongs ?
    // https://www.freecodecamp.org/neyarnws/how-to-keep-your-footer-where-it-belongs-59c6aa05c59c/

    return (
      <Footer id="footer" style={
        {
          borderTop: '1px solid #e8e8e8',
          backgroundColor: 'white',
          textAlign: 'center',
        }
      }>
        Made with <span style={{color: 'rgb(255, 255, 255)'}}>❤️</span> by <a style={{fontWeight: "bold", color: "black"}} target="_blank" href="https://casbin.org">Casbin</a>
      </Footer>
    )
  }

  render() {
    return (
      <div id="parent-area">
        <BackTop />
        <div id="content-wrap">
          {
            this.renderContent()
          }
        </div>
        {
          this.renderFooter()
        }
      </div>
    );
  }
}

export default withRouter(App);
