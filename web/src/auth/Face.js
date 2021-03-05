// Copyright 2021 The casbin Authors. All Rights Reserved.
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

import React from "react";
import {Button, Checkbox, Col, Form, Input, Row} from "antd";
import {LockOutlined, UserOutlined} from "@ant-design/icons";
import * as AuthBackend from "./AuthBackend";
import * as Provider from "./Provider";
import * as Util from "./Util";

class Face extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      classes: props,
      applicationName: props.applicationName !== undefined ? props.applicationName : (props.match === undefined ? null : props.match.params.applicationName),
      application: null,
    };
  }

  componentWillMount() {
    this.getApplication();
  }

  getApplication() {
    if (this.state.applicationName === null) {
      return;
    }

    AuthBackend.getApplication("admin", this.state.applicationName)
      .then((application) => {
        this.setState({
          application: application,
        });
      });
  }

  getApplicationObj() {
    if (this.props.application !== undefined) {
      return this.props.application;
    } else {
      return this.state.application;
    }
  }

  onFinish(values) {
    AuthBackend.login(values)
      .then((res) => {
        if (res.status === 'ok') {
          this.props.onLoggedIn();
          Util.showMessage("success", `Logged in successfully`);
          Util.goToLink("/");
        } else {
          Util.showMessage("error", `Log in failed：${res.msg}`);
        }
      });
  };

  renderForm(application) {
    return (
      <Form
        name="normal_login"
        initialValues={{
          organization: application.organization,
          remember: true
        }}
        onFinish={this.onFinish.bind(this)}
        style={{width: "250px"}}
        size="large"
      >
        <Form.Item style={{height: 0, visibility: "hidden"}}
          name="organization"
          rules={[{ required: true, message: 'Please input your organization!' }]}
        >
          <Input
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="organization"
            disabled={!application.enablePassword}
          />
        </Form.Item>
        <Form.Item
          name="username"
          rules={[{ required: true, message: 'Please input your Username!' }]}
        >
          <Input
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="username"
            disabled={!application.enablePassword}
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Please input your Password!' }]}
        >
          <Input
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="password"
            disabled={!application.enablePassword}
          />
        </Form.Item>
        <Form.Item>
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox style={{float: "left"}} disabled={!application.enablePassword}>
              Auto login
            </Checkbox>
          </Form.Item>
          <a style={{float: "right"}} href="">
            Forgot password?
          </a>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            style={{width: "100%"}}
            disabled={!application.enablePassword}
          >
            Login
          </Button>
          <div style={{float: "right"}}>
            No account yet, <a href="/register">sign up now</a>
          </div>
        </Form.Item>
        <Form.Item>
          {
            application.providerObjs.map(provider => {
              return (
                <a href={Provider.getAuthUrl(application, provider, "signup")}>
                  <img width={30} height={30} src={Provider.getAuthLogo(provider)} alt={provider.displayName} style={{margin: "3px"}} />
                </a>
              );
            })
          }
        </Form.Item>
      </Form>
    );
  }

  render() {
    const application = this.getApplicationObj();
    if (application === null) {
      return null;
    }

    return (
      <Row>
        <Col span={24} style={{display: "flex", justifyContent:  "center"}} >
          <div style={{marginTop: "80px", textAlign: "center"}}>
            <img width={250} src={application.logo} alt={application.displayName} style={{marginBottom: '30px'}}/>
            {
              this.renderForm(application)
            }
          </div>
        </Col>
      </Row>
    )
  }
}

export default Face;
